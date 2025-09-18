import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

export default function Home() {
  return (
    <div className="flex flex-col gap-y-4">
      <p className="text-2xl font-bold">Farm2Table</p>
      <Button variant="elevated">Button</Button>
      <Input placeholder="Enter your name" />
      <Progress value={50} />
      <Textarea placeholder="Enter your message" />
      <Checkbox />
    </div>
  );
}
 