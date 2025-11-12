// import Link from "next/link";
// import { getAllBlogMetaSorted } from "../../lib/blogs";
// import BlogCard from "../../components/BlogCard";

// export const dynamic = "force-static"; // build-time list

export default function BlogsPage() {
    // const blogs = getAllBlogMetaSorted();
    return (
        <main className="max-w-3xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-6">Developing...</h1>
            <div className="space-y-4">
                {/* {blogs.map((b) => (
                    <Link key={b.slug} href={`/blogs/${b.slug}`}>
                        <BlogCard blog={b} />
                    </Link>
                ))} */}
            </div>
        </main>
    );
}
