import { redirect, useLoaderData } from "@remix-run/react";

export async function loader() {
  return redirect("/dialogs");
}

export default function Index() {
  useLoaderData<typeof loader>();
  return null;
}
