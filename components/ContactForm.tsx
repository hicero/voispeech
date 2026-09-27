"use client";
import { useState } from "react";
import { contactUrl } from "./siteConfig";

export default function ContactForm() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  async function copy() {
    try {
      await navigator.clipboard.writeText(message);
      setStatus(
        "문의 내용을 복사했습니다. 이용하시는 상담 채널에 붙여넣어 주세요.",
      );
    } catch {
      setStatus(
        "자동 복사가 되지 않았습니다. 입력한 내용을 직접 선택해 복사해 주세요.",
      );
    }
  }

  return (
    <section id="contact" className="section-pad contact-section">
      <div className="content-shell contact-grid">
        <div className="contact-copy">
          <p className="eyebrow">LET’S FIND YOUR VOICE</p>
          <h2>
            어떤 소리가
            <br />
            어려우신가요?
          </h2>
          <p>막히는 순간이나 배우고 싶은 노래를 편하게 남겨 주세요.</p>
          <p className="contact-small">1:1 발성 코칭 · VoiSpeech</p>
        </div>
        <div className="contact-panel">
          <h3>수업 문의</h3>
          <p>
            {contactUrl
              ? "목표와 희망 일정을 간단히 정리해 상담 채널로 보내 주세요."
              : "온라인 상담 연결을 준비하고 있습니다."}
          </p>
          <label htmlFor="inquiry">문의 내용</label>
          <textarea
            id="inquiry"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              setStatus("");
            }}
            rows={3}
            placeholder="예: 고음에서 힘이 들어가요. ○○ 곡을 편하게 부르고 싶습니다."
          />
          <div className="contact-actions">
            <button
              type="button"
              className="btn-primary"
              disabled={!message.trim()}
              onClick={copy}
            >
              문의 내용 복사
            </button>
            {contactUrl ? (
              <a
                className="btn-outline"
                href={contactUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                상담 채널 열기
              </a>
            ) : null}
          </div>
          <p className="contact-note">
            입력 내용은 전송·저장되지 않습니다.
          </p>
          <p role="status" className="contact-status">
            {status}
          </p>
        </div>
      </div>
    </section>
  );
}
