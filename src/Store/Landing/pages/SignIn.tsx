import AuthLayout from "../../shared/components/layout/AuthPageLayout";
import PageMeta from "../../shared/components/containers/PageMeta";
import SignInForm from "../components/auth/SignInForm";

export default function SignIn() {
  
  return (
    <>
      <PageMeta
        title="React.js SignIn Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js SignIn Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
