"use client";
import { useState } from "react";
import { contactUrl } from "./siteConfig";
export default function ContactForm(){
 const [message,setMessage]=useState("");const [status,setStatus]=useState("");
 async function copy(){try{await navigator.clipboard.writeText(message);setStatus("문의 내용을 복사했습니다. 이용하시는 상담 채널에 붙여넣어 주세요.");}catch{setStatus("자동 복사가 되지 않았습니다. 입력한 내용을 직접 선택해 복사해 주세요.");}}
 return <section id="contact" className="section-pad contact-section"><div className="mx-auto max-w-6xl px-5 md:px-8 contact-grid"><div><p className="eyebrow">LET’S FIND YOUR VOICE</p><h2>어떤 소리가<br/>어려우신가요?</h2><p>자주 막히는 순간이나 배우고 싶은 노래를<br/>편하게 이야기해 주세요.</p><p className="contact-small">1:1 발성 코칭 · VoiSpeech</p></div><div className="contact-panel"><h3>수업 문의</h3><p>{contactUrl ? "상담 채널에서 목표와 희망 일정을 알려 주세요." : "온라인 상담 연결을 준비하고 있습니다. 기존에 안내받으신 연락처가 있다면 해당 채널로 문의해 주세요."}</p><label htmlFor="inquiry">문의할 내용 미리 정리하기</label><textarea id="inquiry" value={message} onChange={e=>{setMessage(e.target.value);setStatus("");}} rows={4} placeholder="예: 고음에서 힘이 많이 들어가요. 좋아하는 곡을 편하게 부르고 싶습니다."/><button type="button" className="btn-primary" disabled={!message.trim()} onClick={copy}>문의 내용 복사</button>{contactUrl && <a className="btn-outline" href={contactUrl} target="_blank" rel="noopener noreferrer">상담 채널 열기</a>}<p className="contact-note">이 입력란은 문의 정리용이며, 입력한 내용은 전송·저장되지 않습니다.</p><p role="status" className="contact-status">{status}</p></div></div></section>;
}
