import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { inputToRow, rowToApplication, type ApplicationRow } from "@/lib/applications/row-mapping";
import { APPLICATION_STATUSES } from "@/types/application";
import type { ApplicationInput } from "@/types/application";

function bearerToken(request: Request): string | null {
  const header = request.headers.get("authorization");
  if (!header?.toLowerCase().startsWith("bearer ")) return null;
  return header.slice(7).trim();
}

export async function POST(request: Request) {
  const env = getSupabaseEnv();
  if (!env) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  const token = bearerToken(request);
  if (!token) {
    return NextResponse.json({ error: "Missing bearer token" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (
    !body ||
    typeof body.company !== "string" ||
    !body.company.trim() ||
    typeof body.position !== "string" ||
    !body.position.trim() ||
    typeof body.appliedDate !== "string"
  ) {
    return NextResponse.json(
      { error: "company, position and appliedDate are required" },
      { status: 400 }
    );
  }
  const status = APPLICATION_STATUSES.includes(body.status) ? body.status : "applied";

  const input: ApplicationInput = {
    company: body.company,
    position: body.position,
    status,
    location: body.location ?? null,
    jobUrl: body.jobUrl ?? null,
    salaryRange: body.salaryRange ?? null,
    source: body.source ?? null,
    appliedDate: body.appliedDate,
    notes: body.notes ?? null,
  };

  // Scoping the client with the user's own access token (rather than a
  // service-role key) means Postgres RLS enforces ownership here exactly as
  // it does for the web app — this route can't act outside what the calling
  // user is already allowed to do.
  const supabase = createClient(env.url, env.anonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("applications")
    .insert(inputToRow(userData.user.id, input))
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(rowToApplication(data as ApplicationRow), { status: 201 });
}
