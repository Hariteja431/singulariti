'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';

export function FeedbackForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subjectType, setSubjectType] = useState('Feedback');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`${subjectType} from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nType: ${subjectType}\n\nMessage/Details:\n${message}`);
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=singulariti.contact@gmail.com&su=${subject}&body=${body}`;
    window.open(gmailUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-surface border border-border p-8 rounded-3xl shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-[13px] font-medium text-ink mb-2">Name</label>
          <input 
            type="text" 
            id="name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-11 px-4 rounded-xl border border-border bg-background focus:border-primary focus:outline-none transition-colors" 
            placeholder="Your Name" 
            required 
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-[13px] font-medium text-ink mb-2">Email</label>
          <input 
            type="email" 
            id="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-11 px-4 rounded-xl border border-border bg-background focus:border-primary focus:outline-none transition-colors" 
            placeholder="your@email.com" 
            required 
          />
        </div>
      </div>
      <div>
        <label htmlFor="subjectType" className="block text-[13px] font-medium text-ink mb-2">What is this regarding?</label>
        <select
          id="subjectType"
          value={subjectType}
          onChange={(e) => setSubjectType(e.target.value)}
          className="w-full h-11 px-4 rounded-xl border border-border bg-background focus:border-primary focus:outline-none transition-colors"
        >
          <option value="Feedback">General Feedback</option>
          <option value="Tool Request">Request a New Tool</option>
          <option value="Bug Report">Report a Bug</option>
        </select>
      </div>
      <div>
        <label htmlFor="message" className="block text-[13px] font-medium text-ink mb-2">Details</label>
        <textarea 
          id="message" 
          rows={6} 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-4 rounded-xl border border-border bg-background focus:border-primary focus:outline-none transition-colors resize-y" 
          placeholder="Please describe your idea, feedback, or the issue you encountered..." 
          required
        ></textarea>
      </div>
      <Button variant="primary" size="lg" className="w-full cursor-pointer py-4 rounded-xl font-bold" type="submit">
        Send via Gmail
      </Button>
    </form>
  );
}
