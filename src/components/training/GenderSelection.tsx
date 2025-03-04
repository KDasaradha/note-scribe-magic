
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { TrainingSettings } from "@/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { User, UserCircle2 } from "lucide-react";

interface GenderSelectionProps {
  onSelect: (settings: TrainingSettings) => void;
}

export function GenderSelection({ onSelect }: GenderSelectionProps) {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [level, setLevel] = useState<"beginner" | "intermediate" | "advanced">("beginner");
  const [duration, setDuration] = useState<number>(30);

  const handleSubmit = () => {
    onSelect({
      gender,
      level,
      duration
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Training Settings</CardTitle>
        <CardDescription>
          Customize your training experience
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Select Gender</Label>
          <RadioGroup
            value={gender}
            onValueChange={(value) => setGender(value as "male" | "female")}
            className="grid grid-cols-2 gap-4 pt-2"
          >
            <div>
              <RadioGroupItem
                value="male"
                id="male"
                className="peer sr-only"
              />
              <Label
                htmlFor="male"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-card p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <User className="mb-3 h-6 w-6" />
                <span className="text-sm font-medium">Male</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem
                value="female"
                id="female"
                className="peer sr-only"
              />
              <Label
                htmlFor="female"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-card p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <UserCircle2 className="mb-3 h-6 w-6" />
                <span className="text-sm font-medium">Female</span>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label>Experience Level</Label>
          <RadioGroup
            value={level}
            onValueChange={(value) => setLevel(value as "beginner" | "intermediate" | "advanced")}
            className="grid grid-cols-3 gap-2 pt-2"
          >
            <div>
              <RadioGroupItem
                value="beginner"
                id="beginner"
                className="peer sr-only"
              />
              <Label
                htmlFor="beginner"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-card p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <span className="text-sm font-medium">Beginner</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem
                value="intermediate"
                id="intermediate"
                className="peer sr-only"
              />
              <Label
                htmlFor="intermediate"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-card p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <span className="text-sm font-medium">Intermediate</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem
                value="advanced"
                id="advanced"
                className="peer sr-only"
              />
              <Label
                htmlFor="advanced"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-card p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <span className="text-sm font-medium">Advanced</span>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">Training Duration (minutes)</Label>
          <div className="grid grid-cols-3 gap-4">
            {[15, 30, 45].map((mins) => (
              <Button
                key={mins}
                type="button"
                variant={duration === mins ? "default" : "outline"}
                onClick={() => setDuration(mins)}
                className="w-full"
              >
                {mins} min
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} className="w-full">
          Start Training
        </Button>
      </CardFooter>
    </Card>
  );
}
