import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/components/ui/use-toast";
import {
  $isSessionEnded,
  $isSessionStarted,
  $sessionData,
} from "@/stores/sessionStore";
import { useStore } from "@nanostores/react";
import { useEffect, useState } from "react";
import type { TCard, TOutputCard } from "src/cards.d";
import RandomCardManager from "./RandomCardManager";
import SessionInputCard from "./SessionInputCard";

type Props = {
  cards: TCard[];
  outputCards: TOutputCard[];
};

const RandomCardPage = ({ cards, outputCards }: Props) => {
  const [isSubmittingData, setIsSubmittingData] = useState(false);
  const isSessionStarted = useStore($isSessionStarted);
  const isSessionEnded = useStore($isSessionEnded);
  const sessionData = useStore($sessionData);
  console.table(sessionData);

  const resetSession = () => {
    // reset the session data because
    // the session has ended, and the data has been submitted
    $isSessionStarted.set(false);
    $isSessionEnded.set(false);
    $sessionData.set([]);
  };

  // when session ends, commit the session data to the database
  useEffect(() => {
    console.log("isSessionEnded", isSessionEnded);

    // this function is called, but should be no-op
    if (!isSessionEnded) return;

    // we're loading
    setIsSubmittingData(true);

    // make a call to /api/sessions with the data and print response
    fetch("/api/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sessionData),
    })
      .then((res) => {
        if (res.status === 200) {
          // send a success toast
          toast({
            title: "Data Submitted.",
          });

          // reset the session data because
          // the data has been submitted and stored
          resetSession();
        } else {
          // send an error toast
          toast({
            title: "Error submitting data. Please download the data manually.",
            variant: "destructive",
          });

          // don't reset the session data because
          // the data has not been submitted
        }

        // we have a response
        setIsSubmittingData(false);

        res.json();
      })
      .then((data) => console.log(data));
  }, [isSessionEnded]);

  const handleDownload = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(sessionData));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `session-${Date.now()}.json`);
    // required for firefox
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();

    // Reset session after download
    resetSession();
  };

  // if session has ended, there's data to submit, but submitting of the data failed
  const shouldShowDownloadButton =
    isSessionEnded && sessionData.length > 0 && !isSubmittingData;

  return (
    <>
      <div className="space-y-4">
        {!isSessionEnded && isSessionStarted ? (
          <RandomCardManager cards={cards} outputCards={outputCards} />
        ) : (
          <div className="mt-4 flex w-full items-center justify-center">
            <SessionInputCard />
          </div>
        )}

        {shouldShowDownloadButton && (
          <Card className="mx-auto w-96">
            <CardHeader>
              <h1 className="text-lg">
                Your session has ended, however the data has not been submitted.
                Please download the data manually to keep a copy.
              </h1>
            </CardHeader>

            <CardContent>
              <Button onClick={handleDownload}>Download Data</Button>
            </CardContent>
          </Card>
        )}
      </div>

      <Toaster />
    </>
  );
};

export default RandomCardPage;
