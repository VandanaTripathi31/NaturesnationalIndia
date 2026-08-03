import Link from "next/link";
import { Pencil, Plus, Trash2 } from "lucide-react";

import { DataTable, Td } from "@/components/admin/data-table";
import { EmptyState, PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deletePost } from "@/features/admin/actions";
import { getBlogPosts } from "@/features/content";

export default async function AdminBlogPage() {
  const posts = await getBlogPosts();

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <PageHeader title="Blog" />
        <Button asChild>
          <Link href="/admin/blog/new">
            <Plus className="size-4" />
            New post
          </Link>
        </Button>
      </div>

      {posts.length === 0 ? (
        <EmptyState title="No posts" description="Write your first blog post." />
      ) : (
        <DataTable headers={["Title", "Category", "Author", ""]}>
          {posts.map((p) => (
            <tr key={p.slug}>
              <Td className="font-medium">{p.title}</Td>
              <Td>
                <Badge variant="muted">{p.category}</Badge>
              </Td>
              <Td>{p.author}</Td>
              <Td>
                <div className="flex justify-end gap-2">
                  <Button asChild variant="ghost" size="icon" aria-label="Edit">
                    <Link href={`/admin/blog/${p.slug}/edit`}>
                      <Pencil className="size-4" />
                    </Link>
                  </Button>
                  <form action={deletePost}>
                    <input type="hidden" name="slug" value={p.slug} />
                    <Button variant="ghost" size="icon" aria-label="Delete" type="submit">
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </form>
                </div>
              </Td>
            </tr>
          ))}
        </DataTable>
      )}
    </div>
  );
}
