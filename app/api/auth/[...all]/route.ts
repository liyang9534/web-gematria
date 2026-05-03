import { getAuth } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  return getAuth().handler(req);
}

export async function POST(req: NextRequest) {
  return getAuth().handler(req);
}

export async function PUT(req: NextRequest) {
  return getAuth().handler(req);
}

export async function DELETE(req: NextRequest) {
  return getAuth().handler(req);
}

export async function PATCH(req: NextRequest) {
  return getAuth().handler(req);
}
