'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';

export function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Contact from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=singulariti.contact@gmail.com&su=${subject}&body=${body}`;
    window.open(gmailUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-[13px] font-medium text-ink mb-2">Name</label>
        <input 
          type="text" 
          id="name" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full h-10 px-4 rounded-md border border-border bg-surface focus:outline-primary" 
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
          className="w-full h-10 px-4 rounded-md border border-border bg-surface focus:outline-primary" 
          placeholder="your@email.com" 
          required 
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-[13px] font-medium text-ink mb-2">Message</label>
        <textarea 
          id="message" 
          rows={5} 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-4 rounded-md border border-border bg-surface focus:outline-primary" 
          placeholder="Enter details here..." 
          required
        ></textarea>
      </div>
      <Button variant="primary" size="lg" className="w-full cursor-pointer" type="submit">
        Send Message
      </Button>
    </form>
  );
}
