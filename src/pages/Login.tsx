import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle>EFL League</CardTitle>
        </CardHeader>

        <CardContent>
          <Button
            className="w-full"
            size="lg"
            onClick={() => {
              localStorage.setItem("efl_auth", "true");
              window.location.href = "/";
            }}
          >
            Enter Portal
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
