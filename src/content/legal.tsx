import type { ReactNode } from "react";

// Legal documents shown in the footer modals.
// TEMPLATE TEXT: written as a sensible starting point for a New Zealand
// business (Privacy Act 2020, Consumer Guarantees Act 1993, Fair Trading Act
// 1986). Have it reviewed by your lawyer and adjusted to how the business
// actually handles data before the site goes live.

export type LegalDoc = {
  id: "privacy" | "terms" | "cookies";
  title: string;
  updated: string;
  body: ReactNode;
};

const COMPANY = "RF Data Systems Limited";
const EMAIL = "info@rfdsl.co.nz";
const PHONE = "+64 09 553 7261";
const ADDRESS = "5C Target Court, Wairau Valley, Auckland, New Zealand";
const UPDATED = "19 November 2026";

function H({ children }: { children: ReactNode }) {
  return <h3 className="mt-7 text-base font-bold text-neutral-950 first:mt-0">{children}</h3>;
}
function P({ children }: { children: ReactNode }) {
  return <p className="mt-2 text-[15px] leading-relaxed text-slate-600">{children}</p>;
}
function UL({ children }: { children: ReactNode }) {
  return <ul className="mt-2 list-disc space-y-1 pl-5 text-[15px] leading-relaxed text-slate-600">{children}</ul>;
}
function Contact() {
  return (
    <UL>
      <li>
        Email:{" "}
        <a href={`mailto:${EMAIL}`} className="font-medium text-blue-700 underline-offset-2 hover:underline">
          {EMAIL}
        </a>
      </li>
      <li>Phone: {PHONE}</li>
      <li>Post: {ADDRESS}</li>
    </UL>
  );
}

export const LEGAL_DOCS: LegalDoc[] = [
  {
    id: "privacy",
    title: "Privacy Policy",
    updated: UPDATED,
    body: (
      <>
        <P>
          {COMPANY} (&quot;RF DATA&quot;, &quot;we&quot;, &quot;us&quot;) respects your privacy. This policy explains what
          personal information we collect, how we use it and the choices you have. We handle personal information in
          line with the Privacy Act 2020.
        </P>

        <H>1. Information we collect</H>
        <P>We only collect information we need. This may include:</P>
        <UL>
          <li>
            details you give us through our contact form, by email or by phone, such as your name, email address, phone
            number, company name and the content of your enquiry;
          </li>
          <li>information needed to prepare quotes, supply products, carry out site assessments and provide support;</li>
          <li>
            basic technical information recorded automatically by our website host, such as your IP address, browser type
            and the pages you visit.
          </li>
        </UL>

        <H>2. How we use it</H>
        <UL>
          <li>to respond to your enquiries and provide quotes;</li>
          <li>to supply, install and support our products and solutions;</li>
          <li>to manage our relationship with you and keep accurate business records;</li>
          <li>to keep our website secure and working properly;</li>
          <li>to meet our legal and regulatory obligations.</li>
        </UL>
        <P>We will not use your information for unrelated purposes without your consent.</P>

        <H>3. Sharing your information</H>
        <P>
          We do not sell or rent your personal information. We only share it with trusted service providers who help us
          run our business (for example, website hosting, email and IT providers) and who must keep it secure, or where
          the law requires us to.
        </P>

        <H>4. Storage and security</H>
        <P>
          We take reasonable steps to protect your information from loss, misuse and unauthorised access. Some of our
          service providers may store information outside New Zealand; where that happens we take steps to make sure it
          is protected to a standard comparable to New Zealand law. We keep personal information only for as long as we
          need it.
        </P>

        <H>5. Access and correction</H>
        <P>
          You have the right to ask for a copy of the personal information we hold about you and to ask us to correct it.
          Please contact us using the details below. We may need to confirm your identity first.
        </P>

        <H>6. Questions and complaints</H>
        <P>If you have a question or concern about privacy, please contact us:</P>
        <Contact />
        <P>
          If you are not satisfied with our response, you can contact the Office of the Privacy Commissioner at{" "}
          <a
            href="https://www.privacy.org.nz"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blue-700 underline-offset-2 hover:underline"
          >
            privacy.org.nz
          </a>
          .
        </P>

        <H>7. Changes to this policy</H>
        <P>We may update this policy from time to time. The latest version will always be available on this website.</P>
      </>
    ),
  },
  {
    id: "terms",
    title: "Terms of Service",
    updated: UPDATED,
    body: (
      <>
        <P>
          These terms apply to your use of the {COMPANY} website. By using this website, you agree to these terms. If
          you do not agree, please do not use the website.
        </P>

        <H>1. Using this website</H>
        <P>
          You may use this website for lawful purposes only. You must not attempt to interfere with its operation, gain
          unauthorised access to it, or use it to send unsolicited or harmful material.
        </P>

        <H>2. Information on this website</H>
        <P>
          The information on this website is provided for general purposes. We work to keep it accurate and up to date,
          but product specifications, availability and prices can change without notice. Please confirm details with us
          before making a purchasing decision.
        </P>

        <H>3. Quotes, orders and services</H>
        <P>
          Any quote, order, supply of products or provision of services is governed by the quote or agreement we provide
          to you, in addition to these terms.
        </P>

        <H>4. Intellectual property</H>
        <P>
          All content on this website, including text, images, graphics, logos and design, is owned by or licensed to{" "}
          {COMPANY} and is protected by copyright and other intellectual property laws. You may view and print pages for
          your own information, but you must not copy, reproduce, publish or use any content for commercial purposes
          without our prior written permission. Third-party product names and trademarks belong to their respective
          owners.
        </P>

        <H>5. Links to other websites</H>
        <P>
          This website may link to other websites. We are not responsible for their content or practices, and a link
          does not mean we endorse them.
        </P>

        <H>6. Liability</H>
        <P>
          To the extent permitted by law, we are not liable for any loss or damage arising from your use of this website
          or reliance on its content. Nothing in these terms limits any rights you have under the Consumer Guarantees Act
          1993, the Fair Trading Act 1986 or any other law that cannot be excluded.
        </P>

        <H>7. Governing law</H>
        <P>These terms are governed by the laws of New Zealand, and the courts of New Zealand have jurisdiction.</P>

        <H>8. Changes and contact</H>
        <P>We may update these terms from time to time. If you have any questions, please contact us:</P>
        <Contact />
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookie Policy",
    updated: UPDATED,
    body: (
      <>
        <P>
          Cookies are small text files that a website can store on your device. This policy explains how the{" "}
          {COMPANY} website uses them.
        </P>

        <H>1. How we use cookies</H>
        <P>
          We do not use advertising or tracking cookies. This website may use cookies that are strictly necessary for it
          to work securely and correctly; these do not identify you personally.
        </P>

        <H>2. Embedded maps</H>
        <P>
          Our About Us page shows an embedded Google Map so you can see where we are. When the map loads, Google may set
          its own cookies, which are covered by{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blue-700 underline-offset-2 hover:underline"
          >
            Google&apos;s Privacy Policy
          </a>
          .
        </P>

        <H>3. Analytics</H>
        <P>
          If we introduce website analytics in the future to understand how visitors use the site, we will update this
          policy first and ask for your consent where required.
        </P>

        <H>4. Managing cookies</H>
        <P>
          You can block or delete cookies in your browser settings. Blocking strictly necessary cookies may stop parts of
          the website from working properly.
        </P>

        <H>5. Contact</H>
        <P>If you have any questions about this policy, please contact us:</P>
        <Contact />
      </>
    ),
  },
];
