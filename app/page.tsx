"use client";

import { useState, useRef } from "react";
import { Mic, MicOff, Copy, Trash, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

// Define SpeechRecognition type
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function VoiceToText() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  // Track processed segments to prevent duplicates
  const processedSegmentsRef = useRef<Set<string>>(new Set());
  const lastResultsRef = useRef<string[]>([]);
  const finalTranscriptRef = useRef("");

  // Generate a unique ID for segments
  const generateUniqueId = (text: string) => {
    return `${text.trim().toLowerCase()}_${Date.now()}`;
  };

  // Start voice recognition
  const startRecording = () => {
    if (isRecording) return;

    try {
      // Check browser support
      if (
        !("webkitSpeechRecognition" in window) &&
        !("SpeechRecognition" in window)
      ) {
        toast({
          title: "Unsupported Browser",
          description: "Your browser doesn't support speech recognition.",
          variant: "destructive",
        });
        return;
      }

      // Reset tracking references for new session
      processedSegmentsRef.current = new Set();
      lastResultsRef.current = [];

      setIsProcessing(true);
      setIsRecording(true);

      // Initialize SpeechRecognition
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();

      const recognition = recognitionRef.current;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsProcessing(false);
        toast({
          title: "Listening",
          description: "Speak clearly into your microphone.",
        });
      };

      recognition.onresult = (event) => {
        let interimTranscript = "";
        let newFinalTranscript = "";

        // Process results
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const transcriptSegment = result[0].transcript.trim();

          // Skip empty segments
          if (!transcriptSegment) continue;

          // Create a unique ID for this segment
          const segmentId = generateUniqueId(transcriptSegment);

          if (result.isFinal) {
            // Check if we've already processed this segment
            if (!processedSegmentsRef.current.has(segmentId)) {
              processedSegmentsRef.current.add(segmentId);

              // Check for similar content to avoid near-duplicates
              const isDuplicate = lastResultsRef.current.some((prevResult) => {
                const similarity = calculateSimilarity(
                  transcriptSegment,
                  prevResult
                );
                return similarity > 0.8; // 80% similarity threshold
              });

              if (!isDuplicate) {
                newFinalTranscript += transcriptSegment + " ";
                lastResultsRef.current.push(transcriptSegment);

                // Keep history limited
                if (lastResultsRef.current.length > 10) {
                  lastResultsRef.current.shift();
                }
              }
            }
          } else {
            interimTranscript += transcriptSegment + " ";
          }
        }

        // Update final transcript if we have new content
        if (newFinalTranscript) {
          finalTranscriptRef.current += newFinalTranscript;
          setTranscript(
            finalTranscriptRef.current +
              (interimTranscript ? ` ${interimTranscript}` : "")
          );
        } else if (interimTranscript) {
          // Just update with interim results
          setTranscript(finalTranscriptRef.current + ` ${interimTranscript}`);
        }
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsProcessing(false);
        setIsRecording(false);

        toast({
          title: "Error",
          description: `Recognition error: ${event.error}`,
          variant: "destructive",
        });
      };

      recognition.onend = () => {
        if (isRecording) {
          setIsRecording(false);
          setIsProcessing(false);
        }
      };

      recognition.start();
    } catch (error) {
      console.error("Error starting speech recognition:", error);
      setIsProcessing(false);
      setIsRecording(false);
      toast({
        title: "Error",
        description: "Failed to start speech recognition.",
        variant: "destructive",
      });
    }
  };

  // Calculate similarity between two strings (simple implementation)
  const calculateSimilarity = (str1: string, str2: string): number => {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) {
      return 1.0;
    }

    // Check if shorter is contained in longer
    if (longer.includes(shorter)) {
      return shorter.length / longer.length;
    }

    // Simple word overlap check
    const words1 = str1.toLowerCase().split(/\s+/);
    const words2 = str2.toLowerCase().split(/\s+/);

    const commonWords = words1.filter((word) => words2.includes(word));
    return commonWords.length / Math.max(words1.length, words2.length);
  };

  const stopRecording = () => {
    if (!isRecording || !recognitionRef.current) return;

    recognitionRef.current.stop();
    setIsRecording(false);
    setIsProcessing(false);
  };

  const copyToClipboard = () => {
    if (!transcript) return;

    navigator.clipboard
      .writeText(transcript)
      .then(() => {
        toast({
          title: "Copied",
          description: "Text copied to clipboard.",
        });
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
        toast({
          title: "Error",
          description: "Failed to copy text.",
          variant: "destructive",
        });
      });
  };

  const clearTranscript = () => {
    setTranscript("");
    finalTranscriptRef.current = "";
    processedSegmentsRef.current.clear();
    lastResultsRef.current = [];
    toast({
      title: "Cleared",
      description: "Transcript has been cleared.",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center gap-10 p-4 bg-texture">
      <div className="w-full max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-display text-white mb-2">
            <span className="text-primary">Voice</span> t
            <a
              href="https://sayan4.vercel.app"
              className="hover:text-primary delay-200"
            >
              0
            </a>
            o <span className="text-primary">Text</span>
          </h1>
          <p className="text-gray-400 font-text">
            Speak clearly to see real-time transcription
          </p>
        </div>

        <Card className="bg-card/90 backdrop-blur-sm border-neutral-800 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-neutral-800">
            <Badge
              variant={isRecording ? "destructive" : "outline"}
              className="px-3 py-1"
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Initializing...
                </span>
              ) : isRecording ? (
                "Recording"
              ) : (
                "Ready"
              )}
            </Badge>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={copyToClipboard}
                disabled={!transcript}
                title="Copy to clipboard"
                className="h-8 w-8"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={clearTranscript}
                disabled={!transcript}
                title="Clear transcript"
                className="h-8 w-8"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <CardContent className="p-0">
            <div className="min-h-[300px] max-h-[500px] overflow-y-auto p-6 font-text text-lg">
              {transcript ? (
                <p className="whitespace-pre-wrap leading-relaxed">
                  {transcript}
                </p>
              ) : (
                <p className="text-muted-foreground text-center italic py-12">
                  {isProcessing
                    ? "Processing..."
                    : isRecording
                    ? "Listening..."
                    : "Your transcribed text will appear here..."}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 flex justify-center">
          <Button
            variant={isRecording ? "destructive" : "default"}
            size="lg"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isProcessing}
            className="gap-2 px-8 py-6 text-lg rounded-full shadow-lg"
          >
            {isRecording ? (
              <MicOff className="h-5 w-5" />
            ) : (
              <Mic className="h-5 w-5" />
            )}
            {isRecording ? "Stop Recording" : "Start Recording"}
          </Button>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
