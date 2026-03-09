import type { Metadata } from "next";
import { Calendar, MessageSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description: "문의하기 - 협업, 채용, 일반 문의를 남겨주세요.",
};

export default function ContactPage() {
  return (
    <div className="container max-w-4xl py-10">
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Contact</h1>
          <p className="text-muted-foreground">
            협업, 채용, 기술 문의 등 무엇이든 편하게 남겨주세요.
          </p>
        </div>

        {/* 미팅 예약 섹션 */}
        <div id="booking" className="rounded-lg border bg-card p-6 scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">미팅 예약</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            직접 대화가 필요하시면 미팅을 예약해 주세요. 화상 또는 전화로 상담 가능합니다.
          </p>
          <a
            href="https://calendar.app.google/m3nASB14zpwBS73FA"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <Calendar className="h-5 w-5" />
            미팅 예약하기
          </a>
        </div>

        {/* 문의 폼 섹션 */}
        <div id="inquiry" className="space-y-4 scroll-mt-20">
          <div className="flex items-center gap-3">
            <MessageSquare className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">문의하기</h2>
          </div>
          <div className="rounded-lg border bg-card overflow-hidden">
            <iframe
              src="https://docs.google.com/forms/d/e/1FAIpQLSeeQ1Y15g8A6BVo0ieHMN5WZ9t5afZimoTY1Ib6-AZnlpfkkw/viewform?embedded=true"
              width="100%"
              height="800"
              frameBorder={0}
              marginHeight={0}
              marginWidth={0}
              className="bg-background"
              title="Contact Form"
            >
              로딩 중...
            </iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
