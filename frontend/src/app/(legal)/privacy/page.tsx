import { BRAND } from "@/presentation/config/brand";

export const metadata = { title: "Privacy Policy" };

const LAST_UPDATED = "July 26, 2026";

export default function PrivacyPage() {
  return (
    <article className="max-w-none space-y-4 text-sm leading-relaxed text-foreground [&_h2]:mt-6 [&_h2]:text-lg [&_h2]:font-semibold [&_li]:mt-1 [&_p]:mt-2 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-5">
      <h1 className="text-2xl font-semibold text-foreground">Privacy Policy</h1>
      <p className="text-sm text-muted">Last updated: {LAST_UPDATED}</p>

      <p>
        {BRAND.name} is a free, non-commercial, personal/portfolio project. We
        do not sell data, run advertising, or derive any financial benefit from
        your information. This policy explains, in plain terms, what data the
        App handles and why.
      </p>

      <h2>1. Information you provide</h2>
      <ul>
        <li>
          <strong>Account &amp; profile data</strong> — email, password (stored
          hashed, never in plain text), name, avatar/cover images, intro,
          experience, education, skills, languages, and preferred locale.
        </li>
        <li>
          <strong>Content</strong> — posts, comments, reactions, connection
          requests, and message metadata you create while using the App.
        </li>
        <li>
          <strong>Uploads</strong> — images you attach to your profile, posts,
          comments, or messages.
        </li>
      </ul>

      <h2>2. Device information — used only for message encryption</h2>
      <p>
        To provide end-to-end encrypted direct messaging, the App generates a
        cryptographic <strong>device key pair</strong> (an ECDH P-256 identity
        key and signed pre-key) directly in your browser the first time you open
        Messaging. Only the <strong>public</strong> half of these keys, together
        with a device identifier, is registered with our server via the{" "}
        <code>/devices</code> endpoint.
      </p>
      <p>
        This is the sole purpose for which device-related information is
        collected:
      </p>
      <ul>
        <li>
          the device/public key registration lets other users&rsquo; browsers
          encrypt messages that only your device can decrypt;
        </li>
        <li>
          your <strong>private key never leaves your browser</strong> and is
          never transmitted to, or stored on, our server;
        </li>
        <li>
          we do not use device information for fingerprinting, advertising,
          analytics, tracking across sites, or any purpose unrelated to enabling
          encrypted messaging.
        </li>
      </ul>
      <p>
        Because message bodies are encrypted client-side before they reach the
        server, the server only ever stores ciphertext envelopes (encrypted
        payload, nonce, key version) — not the plaintext content of your
        conversations.
      </p>

      <h2>3. Information collected automatically</h2>
      <p>
        Standard technical data needed to operate the service: authentication
        tokens (JWT stored in httpOnly cookies), session/presence status
        (online/offline, in-memory only, not persisted long-term), and basic
        request logs (e.g. for debugging) that a typical web server produces. We
        do not use third-party advertising trackers or sell any collected data
        to third parties.
      </p>

      <h2>4. How information is used</h2>
      <ul>
        <li>to operate core features: feed, profiles, network, messaging;</li>
        <li>to authenticate you and keep your session secure;</li>
        <li>
          to enable end-to-end encrypted messaging (device public keys, as
          described above);
        </li>
        <li>to maintain and debug the App during its development.</li>
      </ul>
      <p>
        We do not use your data for advertising, profiling for commercial
        purposes, or any monetization scheme, because none exists for this
        project.
      </p>

      <h2>5. Sharing of information</h2>
      <p>
        We do not sell, rent, or trade your personal information. Content you
        post publicly (e.g. feed posts, comments, profile fields) is visible to
        other users of the App as intended by the relevant feature. Message
        contents are encrypted and not accessible to the Developer in readable
        form. Data may be disclosed if required by applicable law or a valid
        legal request.
      </p>

      <h2>6. Data storage and security</h2>
      <p>
        Data is stored in a PostgreSQL database operated for this project.
        Reasonable technical measures (hashed passwords, httpOnly auth cookies,
        client-side end-to-end encryption for messages) are used, but as an
        experimental, non-commercial project, the App
        <strong> cannot guarantee absolute security</strong> and is provided
        without warranty, as described in the Terms of Use. Please avoid storing
        highly sensitive personal information in the App.
      </p>

      <h2>7. Data retention and deletion</h2>
      <p>
        As this is an actively developed pet project, data (including accounts,
        posts, and messages) may be reset, migrated, or deleted at any time as
        part of ordinary development activity, without notice. You may request
        deletion of your account and associated data at any time by contacting
        the Developer.
      </p>

      <h2>8. Your choices and rights</h2>
      <p>
        Depending on your jurisdiction, you may have rights to access, correct,
        export, or delete your personal data. You can update most profile
        information directly in the App, or contact the Developer to make a
        request regarding your data.
      </p>

      <h2>9. Children&rsquo;s privacy</h2>
      <p>
        The App is not directed at children and is not intended for use by
        anyone under the minimum age required by applicable law to consent to
        data processing without parental approval.
      </p>

      <h2>10. Changes to this policy</h2>
      <p>
        This Privacy Policy may be updated from time to time as the project
        evolves. The &ldquo;Last updated&rdquo; date at the top reflects the
        latest revision. Continued use of the App after changes take effect
        constitutes acceptance of the updated policy.
      </p>

      <h2>11. Contact</h2>
      <p>
        For any question or request about this Privacy Policy or your data,
        contact the Developer via the address published in the App&rsquo;s
        repository / support channel.
      </p>
    </article>
  );
}
