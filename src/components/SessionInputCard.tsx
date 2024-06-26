import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  $chosenDevice,
  $chosenSession,
  $isEyeTracked,
  $isSessionStarted,
} from "@/stores/sessionStore";
import { useStore } from "@nanostores/react";

// make a list of possible sessions
// session 1 to session 10
const POSSIBLE_SESSIONS = Array.from(
  { length: 10 },
  (_, i) => `Session ${i + 1}`,
);

// make a list of possible devices
// device 1 to device 10
const POSSIBLE_DEVICES = Array.from(
  { length: 10 },
  (_, i) => `Device ${i + 1}`,
);

export default function SessionInputCard() {
  const isEyeTracked = useStore($isEyeTracked);
  const chosenSession = useStore($chosenSession);
  const chosenDevice = useStore($chosenDevice);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        $isSessionStarted.set(true);

        console.table({
          isEyeTracked,
          chosenSession,
          chosenDevice,
        });
      }}
    >
      <Card className="mx-auto w-96">
        <CardHeader>
          <CardTitle>Start a New Session</CardTitle>
          <CardDescription>Confirm the below options to begin</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <Select
              required
              value={chosenSession}
              onValueChange={(value) => {
                $chosenSession.set(value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a Session" />
              </SelectTrigger>

              <SelectContent>
                {POSSIBLE_SESSIONS.map((session) => (
                  <SelectItem value={session} key={session}>
                    {session}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select
              required
              value={chosenDevice}
              onValueChange={(value) => {
                $chosenDevice.set(value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a Device Number" />
              </SelectTrigger>

              <SelectContent>
                {POSSIBLE_DEVICES.map((device) => (
                  <SelectItem value={device} key={device}>
                    {device}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between space-x-4">
            <span>ET Enabled</span>
            <Switch
              checked={isEyeTracked}
              onCheckedChange={(checked) => {
                $isEyeTracked.set(checked);
              }}
            />
          </div>
        </CardContent>

        <CardFooter>
          <Button type="submit" variant="outline" className="ml-auto">
            Start Session
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
