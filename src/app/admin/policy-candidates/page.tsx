import { requireStaff } from "@/lib/auth";
import { CandidateReview } from "./candidate-review";
export default async function Page() {
  await requireStaff("/admin/policy-candidates");
  return (
    <main className="module-page">
      <p className="eyebrow">ADMIN / POLICY CANDIDATES</p>
      <CandidateReview />
    </main>
  );
}
