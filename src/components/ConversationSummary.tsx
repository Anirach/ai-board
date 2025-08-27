import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  FileText, 
  Download, 
  Loader2, 
  FileDown, 
  BookOpen,
  Calendar,
  Users,
  MessageSquare
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ai, type ConversationSummary } from '@/lib/api';
import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';

interface ConversationSummaryProps {
  conversationId: string;
  conversationTitle: string;
  boardName: string;
  messageCount: number;
  participants: string[];
}

const ConversationSummaryDialog: React.FC<ConversationSummaryProps> = ({
  conversationId,
  conversationTitle,
  boardName,
  messageCount,
  participants
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [summary, setSummary] = useState<ConversationSummary | null>(null);
  const [summaryFormat, setSummaryFormat] = useState<'detailed' | 'executive'>('detailed');
  const { toast } = useToast();

  const generateSummary = async () => {
    if (!conversationId) {
      toast({
        title: "Error",
        description: "No conversation selected",
        variant: "destructive",
      });
      return;
    }

    // Prevent requests for empty conversations
    if (messageCount === 0) {
      toast({
        title: "No messages",
        description: "This conversation has no messages to summarize.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await ai.generateSummary(conversationId, summaryFormat);
      setSummary(response.data.data);  // Extracting data from the nested response
      toast({
        title: "Summary Generated",
        description: "AI summary has been generated successfully",
      });
    } catch (error) {
      console.error('Summary generation error:', error);
      toast({
        title: "Error",
        description: "Failed to generate summary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const exportToPDF = async () => {
    if (!summary) return;
    
    setIsExporting(true);
    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 20;
      const maxLineWidth = pageWidth - (margin * 2);
      
      let yPosition = margin;
      
      // Title
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Conversation Summary', margin, yPosition);
      yPosition += 15;
      
      // Metadata
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      
      const metadata = [
        `Board: ${summary.boardName}`,
        `Conversation: ${summary.conversationTitle}`,
        `Date: ${summary.date}`,
        `Participants: ${summary.participants.join(', ')}`,
        `Messages: ${summary.messageCount}`,
        `Format: ${summary.format.charAt(0).toUpperCase() + summary.format.slice(1)}`,
        `Generated: ${new Date(summary.generatedAt).toLocaleString()}`
      ];
      
      metadata.forEach(line => {
        pdf.text(line, margin, yPosition);
        yPosition += 8;
      });
      
      yPosition += 10;
      
      // Summary content
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Summary', margin, yPosition);
      yPosition += 10;
      
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      
      const summaryLines = pdf.splitTextToSize(summary.summary, maxLineWidth);
      summaryLines.forEach((line: string) => {
        if (yPosition > pdf.internal.pageSize.getHeight() - margin) {
          pdf.addPage();
          yPosition = margin;
        }
        pdf.text(line, margin, yPosition);
        yPosition += 6;
      });
      
      const fileName = `${summary.boardName}-${summary.conversationTitle}-Summary.pdf`
        .replace(/[^a-z0-9]/gi, '_').toLowerCase();
      
      pdf.save(fileName);
      
      toast({
        title: "PDF Exported",
        description: "Summary has been exported as PDF",
      });
    } catch (error) {
      console.error('PDF export error:', error);
      toast({
        title: "Export Error",
        description: "Failed to export PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportToWord = async () => {
    if (!summary) return;
    
    setIsExporting(true);
    try {
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              text: "Conversation Summary",
              heading: HeadingLevel.TITLE,
              spacing: { after: 300 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Board: ", bold: true }),
                new TextRun(summary.boardName)
              ],
              spacing: { after: 100 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Conversation: ", bold: true }),
                new TextRun(summary.conversationTitle)
              ],
              spacing: { after: 100 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Date: ", bold: true }),
                new TextRun(summary.date)
              ],
              spacing: { after: 100 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Participants: ", bold: true }),
                new TextRun(summary.participants.join(', '))
              ],
              spacing: { after: 100 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Messages: ", bold: true }),
                new TextRun(summary.messageCount.toString())
              ],
              spacing: { after: 100 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Format: ", bold: true }),
                new TextRun(summary.format.charAt(0).toUpperCase() + summary.format.slice(1))
              ],
              spacing: { after: 100 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Generated: ", bold: true }),
                new TextRun(new Date(summary.generatedAt).toLocaleString())
              ],
              spacing: { after: 300 }
            }),
            new Paragraph({
              text: "Summary",
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 300, after: 200 }
            }),
            new Paragraph({
              text: summary.summary,
              spacing: { after: 200 }
            })
          ]
        }]
      });

      const buffer = await Packer.toBuffer(doc);
      const fileName = `${summary.boardName}-${summary.conversationTitle}-Summary.docx`
        .replace(/[^a-z0-9]/gi, '_').toLowerCase();
      
      const uint8Array = new Uint8Array(buffer);
      const blob = new Blob([uint8Array], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      saveAs(blob, fileName);
      
      toast({
        title: "Word Document Exported",
        description: "Summary has been exported as Word document",
      });
    } catch (error) {
      console.error('Word export error:', error);
      toast({
        title: "Export Error",
        description: "Failed to export Word document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full justify-start gap-2">
          <FileText className="h-4 w-4" />
          Generate Summary
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>AI Conversation Summary</DialogTitle>
          <DialogDescription>
            Generate an AI-powered summary of your boardroom conversation and export it as PDF or Word document.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Conversation Info */}
          <Card className="p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Board:</span>
                <span>{boardName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Date:</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Messages:</span>
                <span>{messageCount}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Participants:</span>
                <span>{participants.length}</span>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1">
              {participants.map((participant, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {participant}
                </Badge>
              ))}
            </div>
          </Card>

          {/* Summary Format Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Summary Format</label>
            <Select value={summaryFormat} onValueChange={(value: 'detailed' | 'executive') => setSummaryFormat(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="executive">Executive Summary (Concise)</SelectItem>
                <SelectItem value="detailed">Detailed Summary (Comprehensive)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Generate Button */}
          <Button 
            onClick={generateSummary} 
            disabled={isGenerating || !conversationId || messageCount === 0}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating Summary...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                Generate AI Summary
              </>
            )}
          </Button>

          {/* Summary Display */}
          {summary && (
            <div className="space-y-4">
              {summary.usedBoardFallback && (
                <div className="text-sm text-yellow-600">Note: The selected conversation had no messages, so this summary was generated from recent messages across the board.</div>
              )}
              <Separator />
              <div>
                <h4 className="font-medium mb-2">Generated Summary</h4>
                <Textarea 
                  value={summary.summary}
                  readOnly
                  className="min-h-[300px] resize-none"
                />
              </div>
              
              {/* Export Buttons */}
              <div className="flex gap-2">
                <Button 
                  onClick={exportToPDF}
                  disabled={isExporting}
                  variant="outline"
                  className="flex-1"
                >
                  {isExporting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <FileDown className="h-4 w-4 mr-2" />
                  )}
                  Export PDF
                </Button>
                <Button 
                  onClick={exportToWord}
                  disabled={isExporting}
                  variant="outline"
                  className="flex-1"
                >
                  {isExporting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  Export Word
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConversationSummaryDialog;
