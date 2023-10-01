import { NextResponse } from "next/server";

export function NOT_FOUND(message?: string) {
  return NextResponse.json({ message: message ?? "Not found" }, { status: 404 });
}

export function METHOD_NOT_ALLOWED(message?: string) {
  return NextResponse.json({ message: message ?? "Method not allowed" }, { status: 405 });
}

export function BAD_REQUEST(message?: string) {
  return NextResponse.json({ message: message ?? "Bad request" }, { status: 400 });
}

export function UNAUTHORIZED(message?: string) {
  return NextResponse.json({ message: message ?? "Unauthorized" }, { status: 401 });
}

export function FORBIDDEN(message?: string) {
  return NextResponse.json({ message: message ?? "Forbidden" }, { status: 403 });
}

export function RATE_LIMIT_EXCEEDED(message?: string) {
  return NextResponse.json({ message: message ?? "Rate limit exceeded" }, { status: 429 });
}

export function INTERNAL_SERVER_ERROR(message?: string) {
  return NextResponse.json({ message: message ?? "Internal server error" }, { status: 500 });
}
