import { BRAND } from "@/presentation/config/brand";

export const metadata = { title: "Terms of Use" };

const LAST_UPDATED = "July 26, 2026";

export default function TermsPage() {
  return (
    <article className="max-w-none space-y-4 text-sm leading-relaxed text-foreground [&_h2]:mt-6 [&_h2]:text-lg [&_h2]:font-semibold [&_li]:mt-1 [&_p]:mt-2 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-5">
      <h1 className="text-2xl font-semibold text-foreground">Terms of Use</h1>
      <p className="text-sm text-muted">Last updated: {LAST_UPDATED}</p>

      <h2>1. What {BRAND.name} is</h2>
      <p>
        {BRAND.name} (&ldquo;the App&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;)
        is an independent, non-commercial personal / portfolio project built for
        demonstration, learning, and experimentation purposes. It is developed
        and maintained by a single individual developer (&ldquo;the
        Developer&rdquo;, &ldquo;the Owner&rdquo;) outside of any employment
        relationship, without a registered company or business entity behind it.
      </p>
      <p>
        The App is <strong>not a commercial product or service</strong>. We do
        not sell anything, run advertising, charge subscription fees, or
        otherwise generate revenue or financial benefit of any kind from the App
        or from its users. There is no business model, no monetization, and no
        intent to compete with any commercial product.
      </p>

      <h2>2. Inspiration and resemblance to other products</h2>
      <p>
        The App&rsquo;s design, layout, feature set, naming, or user interface
        may resemble, reference, or be inspired by existing social networks,
        professional networking platforms, messaging apps, or other software
        products. Any such resemblance is either:
      </p>
      <ul>
        <li>
          <strong>incidental and coincidental</strong> — a natural result of
          building common, everyday app features (feeds, profiles, direct
          messages, connections) that are standard patterns across the industry
          and not owned by any single company; or
        </li>
        <li>
          <strong>a non-commercial, transformative homage</strong> — created
          purely for learning purposes, without any intent to imitate, pass off
          as, impersonate, or unfairly compete with any specific third-party
          brand, product, or trademark.
        </li>
      </ul>
      <p>
        The App is not affiliated with, endorsed by, sponsored by, or connected
        in any way to any similarly named or similarly styled commercial
        product. All trademarks, product names, and brand names that may be
        referenced or resembled belong to their respective owners.
      </p>

      <h2>3. Eligibility and accounts</h2>
      <p>
        You must be able to form a binding agreement under the laws applicable
        to you to use the App. You are responsible for the accuracy of the
        information you provide, for keeping your credentials confidential, and
        for all activity that occurs under your account.
      </p>

      <h2>4. Experimental / pet-project nature — use at your own risk</h2>
      <p>
        The App is provided as an experimental, work-in-progress project. It may
        contain bugs, incomplete features, security limitations, or downtime,
        and may be changed, restarted, wiped, or discontinued at any time,
        without notice and without liability. Do not rely on the App for
        anything important, professional, safety-critical, or irreplaceable. Do
        not upload data you cannot afford to lose.
      </p>

      <h2>5. Acceptable use</h2>
      <p>You agree not to use the App to:</p>
      <ul>
        <li>
          upload or share unlawful, infringing, harassing, hateful, or sexually
          exploitative content;
        </li>
        <li>
          attempt to gain unauthorized access to other accounts, the underlying
          infrastructure, or other users&rsquo; data;
        </li>
        <li>
          probe, scan, disrupt, or overload the App (e.g. denial-of-service
          activity), or interfere with its normal operation;
        </li>
        <li>
          use the App for any commercial purpose without the Developer&rsquo;s
          prior written consent;
        </li>
        <li>impersonate another person or entity;</li>
        <li>
          reverse engineer the App&rsquo;s security or encryption mechanisms
          with intent to compromise other users&rsquo; data.
        </li>
      </ul>
      <p>
        We may suspend, remove, or delete any account or content, or restrict or
        terminate access to the App, at our sole discretion and without prior
        notice, particularly where we believe these Terms have been violated.
      </p>

      <h2>6. Your content</h2>
      <p>
        You retain ownership of the content you post (profile information,
        posts, comments, images, and messages). By submitting content to the
        App, you grant the Developer a limited, non-exclusive license to store,
        process, and display that content solely for the purpose of operating
        the App&rsquo;s features. You are solely responsible for the content you
        share and for having the rights to share it.
      </p>
      <p>
        Direct messages are end-to-end encrypted in transit and at rest on the
        server (see the Privacy Policy for details); the Developer has no
        practical ability to read message contents and takes no responsibility
        for their substance.
      </p>

      <h2>7. No warranty</h2>
      <p>
        THE APP IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo;,
        WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT
        LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
        PURPOSE, NON-INFRINGEMENT, AVAILABILITY, ACCURACY, OR DATA SECURITY. THE
        DEVELOPER DOES NOT WARRANT THAT THE APP WILL BE UNINTERRUPTED,
        ERROR-FREE, OR SECURE, OR THAT ANY DATA LOSS WILL NOT OCCUR.
      </p>

      <h2>8. Limitation of liability</h2>
      <p>
        TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, THE DEVELOPER (AND
        ANY CONTRIBUTORS) SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
        SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, OR FOR ANY LOSS
        OF DATA, PROFITS, GOODWILL, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF
        OR RELATING TO YOUR USE OF, OR INABILITY TO USE, THE APP — EVEN IF
        ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. BECAUSE THE APP IS FREE AND
        NON-COMMERCIAL, THE DEVELOPER&rsquo;S TOTAL AGGREGATE LIABILITY FOR ANY
        CLAIM ARISING FROM THE APP SHALL NOT EXCEED THE EQUIVALENT OF ZERO (0)
        UNITS OF ANY CURRENCY, REFLECTING THE FACT THAT NO FEES ARE CHARGED AND
        NO FINANCIAL BENEFIT IS DERIVED FROM THE APP.
      </p>

      <h2>9. Indemnification</h2>
      <p>
        You agree to indemnify and hold harmless the Developer from any claims,
        damages, liabilities, costs, or expenses (including reasonable legal
        fees) arising out of your use of the App, your content, or your
        violation of these Terms or of any third party&rsquo;s rights.
      </p>

      <h2>10. User-generated content and third-party claims</h2>
      <p>
        The App allows users to post their own content. The Developer does not
        pre-screen content and is not responsible for content posted by users.
        If you believe content on the App infringes your rights or violates
        applicable law, contact the Developer (see Section 13) and the relevant
        content will be reviewed and, where appropriate, removed.
      </p>

      <h2>11. Changes and termination</h2>
      <p>
        We may modify, suspend, or discontinue the App, or any part of it, at
        any time, and may update these Terms from time to time. Continued use of
        the App after changes take effect constitutes acceptance of the revised
        Terms. We may terminate or suspend your access immediately, without
        prior notice, for any reason, including breach of these Terms.
      </p>

      <h2>12. Governing law and disputes</h2>
      <p>
        Any dispute arising from these Terms or your use of the App will be
        resolved on an individual basis; you agree not to bring or participate
        in any class, collective, or representative action against the
        Developer. Where legally possible, disputes should first be raised
        informally with the Developer with a view to reaching an amicable
        resolution before any formal proceeding is initiated.
      </p>

      <h2>13. Contact</h2>
      <p>
        Questions about these Terms, or requests regarding content, can be sent
        to the contact address published in the App&rsquo;s repository / support
        channel.
      </p>
    </article>
  );
}
