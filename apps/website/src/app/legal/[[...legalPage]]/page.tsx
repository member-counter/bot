import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { redirect, RedirectType } from "next/navigation";
import { z } from "zod";

import { Card, CardContent, CardHeader, CardTitle } from "@mc/ui/card";
import { LinkUnderlined } from "@mc/ui/LinkUnderlined";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@mc/ui/tabs";
import { TypographyH1 } from "@mc/ui/TypographyH1";
import { TypographyH2 } from "@mc/ui/TypographyH2";
import { TypographyH4 } from "@mc/ui/TypographyH4";
import { TypographyOList, TypographyUList } from "@mc/ui/TypographyList";
import { TypographyP } from "@mc/ui/TypographyP";

import Footer from "~/app/components/Footer";

const legalPageSlugs = [
  "terms-of-service",
  "privacy-policy",
  "cookie-policy",
  "acceptable-use-policy",
] as const;
interface LegalPage {
  title: string;
  page: ReactNode;
}
type LegalPageSlugs = (typeof legalPageSlugs)[number];

const legalPages: Record<LegalPageSlugs, LegalPage> = {
  "terms-of-service": {
    title: "Terms of Service",
    page: (
      <>
        <TypographyP>
          These Terms of Service govern your use of the website located at{" "}
          <LinkUnderlined href="./">
            https://member-counter.eduardozgz.com
          </LinkUnderlined>{" "}
          and any related services provided by Member Counter.{" "}
        </TypographyP>
        <TypographyP>
          By accessing{" "}
          <LinkUnderlined href="./">
            https://member-counter.eduardozgz.com
          </LinkUnderlined>
          , you agree to abide by these Terms of Service and to comply with all
          applicable laws and regulations. If you do not agree with these Terms
          of Service, you are prohibited from using or accessing this website or
          using any other services provided by Member Counter.{" "}
        </TypographyP>
        <TypographyP>
          We, Member Counter, reserve the right to review and amend any of these
          Terms of Service at our sole discretion. Upon doing so, we will update
          this page. Any changes to these Terms of Service will take effect
          immediately from the date of publication.{" "}
        </TypographyP>
        <TypographyP>
          These Terms of Service were last updated on 1 October 2021.{" "}
        </TypographyP>
        <TypographyH2>Limitations of Use</TypographyH2>
        <TypographyP>
          By using this website, you warrant on behalf of yourself, your users,
          and other parties you represent that you will not:{" "}
        </TypographyP>
        <TypographyOList>
          <li>
            modify, copy, prepare derivative works of, decompile, or reverse
            engineer any materials and software contained on this website;
          </li>
          <li>
            remove any copyright or other proprietary notations from any
            materials and software on this website;
          </li>
          <li>
            transfer the materials to another person or “mirror” the materials
            on any other server;
          </li>
          <li>
            knowingly or negligently use this website or any of its associated
            services in a way that abuses or disrupts our networks or any other
            service Member Counter provides;
          </li>
          <li>
            use this website or its associated services to transmit or publish
            any harassing, indecent, obscene, fraudulent, or unlawful material;
          </li>
          <li>
            use this website or its associated services in violation of any
            applicable laws or regulations;
          </li>
          <li>
            use this website in conjunction with sending unauthorized
            advertising or spam;
          </li>
          <li>
            harvest, collect, or gather user data without the user’s consent; or
          </li>
          <li>
            use this website or its associated services in such a way that may
            infringe the privacy, intellectual property rights, or other rights
            of third parties.
          </li>
        </TypographyOList>
        <TypographyH2>Intellectual Property</TypographyH2>
        <TypographyP>
          The intellectual property in the materials contained in this website
          are owned by or licensed to Member Counter and are protected by
          applicable copyright and trademark law. We grant our users permission
          to download one copy of the materials for personal, non-commercial
          transitory use.{" "}
        </TypographyP>
        <TypographyP>
          This constitutes the grant of a license, not a transfer of title. This
          license shall automatically terminate if you violate any of these
          restrictions or the Terms of Service, and may be terminated by Member
          Counter at any time.{" "}
        </TypographyP>
        <TypographyH2>User-Generated Content</TypographyH2>
        <TypographyP>
          You retain your intellectual property ownership rights over content
          you submit to us for publication on our website. We will never claim
          ownership of your content, but we do require a license from you in
          order to use it.{" "}
        </TypographyP>
        <TypographyP>
          When you use our website or its associated services to post, upload,
          share, or otherwise transmit content covered by intellectual property
          rights, you grant to us a non-exclusive, royalty-free, transferable,
          sub-licensable, worldwide license to use, distribute, modify, run,
          copy, publicly display, translate, or otherwise create derivative
          works of your content in a manner that is consistent with your privacy
          preferences and our Privacy Policy.{" "}
        </TypographyP>
        <TypographyP>
          The license you grant us can be terminated at any time by deleting
          your content or account. However, to the extent that we (or our
          partners) have used your content in connection with commercial or
          sponsored content, the license will continue until the relevant
          commercial or post has been discontinued by us.{" "}
        </TypographyP>
        <TypographyP>
          You give us permission to use your username and other identifying
          information associated with your account in a manner that is
          consistent with your privacy preferences, and our Privacy Policy.{" "}
        </TypographyP>
        <TypographyH2>Liability</TypographyH2>
        <TypographyP>
          Our website and the materials on our website are provided on an
          &#39;as is&#39; basis. To the extent permitted by law, Member Counter
          makes no warranties, expressed or implied, and hereby disclaims and
          negates all other warranties including, without limitation, implied
          warranties or conditions of merchantability, fitness for a particular
          purpose, or non-infringement of intellectual property, or other
          violation of rights.{" "}
        </TypographyP>
        <TypographyP>
          In no event shall Member Counter or its suppliers be liable for any
          consequential loss suffered or incurred by you or any third party
          arising from the use or inability to use this website or the materials
          on this website, even if Member Counter or an authorized
          representative has been notified, orally or in writing, of the
          possibility of such damage.{" "}
        </TypographyP>
        <TypographyP>
          In the context of this agreement, &ldquo;consequential loss&rdquo;
          includes any consequential loss, indirect loss, real or anticipated
          loss of profit, loss of benefit, loss of revenue, loss of business,
          loss of goodwill, loss of opportunity, loss of savings, loss of
          reputation, loss of use and/or loss or corruption of data, whether
          under statute, contract, equity, tort (including negligence),
          indemnity, or otherwise.{" "}
        </TypographyP>
        <TypographyP>
          Because some jurisdictions do not allow limitations on implied
          warranties, or limitations of liability for consequential or
          incidental damages, these limitations may not apply to you.{" "}
        </TypographyP>
        <TypographyH2>Accuracy of Materials</TypographyH2>
        <TypographyP>
          The materials appearing on our website are not comprehensive and are
          for general information purposes only. Member Counter does not warrant
          or make any representations concerning the accuracy, likely results,
          or reliability of the use of the materials on this website, or
          otherwise relating to such materials or on any resources linked to
          this website.{" "}
        </TypographyP>
        <TypographyH2>Links</TypographyH2>
        <TypographyP>
          Member Counter has not reviewed all of the sites linked to its website
          and is not responsible for the contents of any such linked site. The
          inclusion of any link does not imply endorsement, approval, or control
          by Member Counter of the site. Use of any such linked site is at your
          own risk and we strongly advise you make your own investigations with
          respect to the suitability of those sites.{" "}
        </TypographyP>
        <TypographyH2>Right to Terminate</TypographyH2>
        <TypographyP>
          We may suspend or terminate your right to use our website and
          terminate these Terms of Service immediately upon written notice to
          you for any breach of these Terms of Service.{" "}
        </TypographyP>
        <TypographyH2>Payment terms</TypographyH2>
        <TypographyOList type="A">
          <li>
            <b>Taxes:</b> Tax law is relegated per country, applicable taxes in
            your region may apply and you are solely responsible to pay them. If
            you are an EU resident, the VAT is included in the price of all our
            products.
          </li>
          <li>
            <b>Refunds:</b> Any purchase is final and non-refundable. You may
            get a partial refund when upgrading a subscription in our products,
            based on for how long have you been using the product during the
            current billing cycle. Credits are not refundable under any
            circumstances.
          </li>
        </TypographyOList>
        <TypographyH2>Severance</TypographyH2>
        <TypographyP>
          Any term of these Terms of Service which is wholly or partially void
          or unenforceable is severed to the extent that it is void or
          unenforceable. The validity of the remainder of these Terms of Service
          is not affected.{" "}
        </TypographyP>
        <TypographyH2>Governing Law</TypographyH2>
        <TypographyP>
          These Terms of Service are governed by and construed in accordance
          with the laws of Spain. You irrevocably submit to the exclusive
          jurisdiction of the courts in that State or location.{" "}
        </TypographyP>
      </>
    ),
  },
  "privacy-policy": {
    title: "Privacy Policy",
    page: (
      <>
        <TypographyP>
          Your privacy is important to us. It is Member Counter&#39;s policy to
          respect your privacy and comply with any applicable law and regulation
          regarding any personal information we may collect about you, including
          across our website,{" "}
          <LinkUnderlined href="/">
            https://member-counter.eduardozgz.com
          </LinkUnderlined>
          , and other sites we own and operate.{" "}
        </TypographyP>
        <TypographyP>
          Personal information is any information about you which can be used to
          identify you. This includes information about you as a person (such as
          name, address, and date of birth), your devices, payment details, and
          even information about how you use a website or online service.{" "}
        </TypographyP>
        <TypographyP>
          In the event our site contains links to third-party sites and
          services, please be aware that those sites and services have their own
          privacy policies. After following a link to any third-party content,
          you should read their posted privacy policy information about how they
          collect and use personal information. This Privacy Policy does not
          apply to any of your activities after you leave our site.{" "}
        </TypographyP>
        <TypographyP>
          This policy is effective as of 1 October 2021.{" "}
        </TypographyP>
        <TypographyP>Last updated: 1 October 2021 </TypographyP>
        <TypographyH2>Information We Collect</TypographyH2>
        <TypographyP>
          Information we collect falls into one of two categories:
          &ldquo;voluntarily provided&rdquo; information and
          &ldquo;automatically collected&rdquo; information.{" "}
        </TypographyP>
        <TypographyP>
          &ldquo;Voluntarily provided&rdquo; information refers to any
          information you knowingly and actively provide us when using or
          participating in any of our services and promotions.{" "}
        </TypographyP>
        <TypographyP>
          &ldquo;Automatically collected&rdquo; information refers to any
          information automatically sent by your devices in the course of
          accessing our products and services.{" "}
        </TypographyP>
        <TypographyH4>Personal Information</TypographyH4>
        <TypographyP>
          We may ask for personal information — for example, when you submit
          content to us or when you contact us — which may include one or more
          of the following:{" "}
        </TypographyP>
        <TypographyUList>
          <li>Country</li>
          <li>Discord user ID</li>
        </TypographyUList>
        <TypographyH4>User-Generated Content</TypographyH4>
        <TypographyP>
          We consider &ldquo;user-generated content&rdquo; to be materials
          (text, image and/or video content) voluntarily supplied to us by our
          users for the purpose of publication on our website or re-publishing
          on our social media channels. All user-generated content is associated
          with the account or email address used to submit the materials.{" "}
        </TypographyP>
        <TypographyP>
          Please be aware that any content you submit for the purpose of
          publication will be public after posting (and subsequent review or
          vetting process). Once published, it may be accessible to third
          parties not covered under this privacy policy.{" "}
        </TypographyP>
        <TypographyH4>
          Legitimate Reasons for Processing Your Personal Information
        </TypographyH4>
        <TypographyP>
          We only collect and use your personal information when we have a
          legitimate reason for doing so. In which instance, we only collect
          personal information that is reasonably necessary to provide our
          services to you.{" "}
        </TypographyP>
        <TypographyH4>Collection and Use of Information</TypographyH4>
        <TypographyP>
          We may collect personal information from you when you do any of the
          following on our website:{" "}
        </TypographyP>
        <TypographyUList>
          <li>Register for an account</li>
          <li>Use a mobile device or web browser to access our content</li>
          <li>
            Contact us via email, social media, or on any similar technologies
          </li>
          <li>When you mention us on social media</li>
        </TypographyUList>
        <TypographyP>
          We may collect, hold, use, and disclose information for the following
          purposes, and personal information will not be further processed in a
          manner that is incompatible with these purposes:{" "}
        </TypographyP>
        <TypographyUList>
          <li>
            to provide you with our platform&#39;s core features and services
          </li>
          <li>to deliver products and/or services to you</li>
          <li>to contact and communicate with you</li>
          <li>
            to enable you to access and use our website, associated
            applications, and associated social media platforms
          </li>
          <li>for internal record keeping and administrative purposes</li>
        </TypographyUList>
        <TypographyP>
          We may combine voluntarily provided and automatically collected
          personal information with general information or research data we
          receive from other trusted sources. For example, Our marketing and
          market research activities may uncover data and insights, which we may
          combine with information about how visitors use our site to improve
          our site and your experience on it.{" "}
        </TypographyP>
        <TypographyH4>Security of Your Personal Information</TypographyH4>
        <TypographyP>
          When we collect and process personal information, and while we retain
          this information, we will protect it within commercially acceptable
          means to prevent loss and theft, as well as unauthorized access,
          disclosure, copying, use, or modification.{" "}
        </TypographyP>
        <TypographyP>
          Although we will do our best to protect the personal information you
          provide to us, we advise that no method of electronic transmission or
          storage is 100% secure, and no one can guarantee absolute data
          security.{" "}
        </TypographyP>
        <TypographyP>
          You are responsible for selecting any password and its overall
          security strength, ensuring the security of your own information
          within the bounds of our services. For example, ensuring any passwords
          associated with accessing your personal information and accounts are
          secure and confidential.{" "}
        </TypographyP>
        <TypographyH4>How Long We Keep Your Personal Information</TypographyH4>
        <TypographyP>
          We keep your personal information only for as long as we need to. This
          time period may depend on what we are using your information for, in
          accordance with this privacy policy. For example, if you have provided
          us with personal information as part of creating an account with us,
          we may retain this information for the duration your account exists on
          our system. If your personal information is no longer required for
          this purpose, we will delete it or make it anonymous by removing all
          details that identify you.{" "}
        </TypographyP>
        <TypographyP>
          However, if necessary, we may retain your personal information for our
          compliance with a legal, accounting, or reporting obligation or for
          archiving purposes in the public interest, scientific, or historical
          research purposes or statistical purposes.{" "}
        </TypographyP>
        <TypographyH2>Children’s Privacy</TypographyH2>
        <TypographyP>
          We do not aim any of our products or services directly at children
          under the age of 13, and we do not knowingly collect personal
          information about children under 13.{" "}
        </TypographyP>
        <TypographyH2>
          Disclosure of Personal Information to Third Parties
        </TypographyH2>
        <TypographyP>We may disclose personal information to: </TypographyP>
        <TypographyUList>
          <li>a parent, subsidiary, or affiliate of our company</li>
          <li>
            third-party service providers for the purpose of enabling them to
            provide their services, including (without limitation) IT service
            providers, data storage, hosting and server providers, error
            loggers, debt collectors, maintenance or problem-solving providers,
            professional advisors, and payment systems operators
          </li>
          <li>our employees, contractors, and/or related entities</li>
          <li>our existing or potential agents or business partners</li>
          <li>
            credit reporting agencies, courts, tribunals, and regulatory
            authorities, in the event you fail to pay for goods or services we
            have provided to you
          </li>
          <li>
            courts, tribunals, regulatory authorities, and law enforcement
            officers, as required by law, in connection with any actual or
            prospective legal proceedings, or in order to establish, exercise,
            or defend our legal rights
          </li>
          <li>
            third parties, including agents or sub-contractors, who assist us in
            providing information, products, services, or direct marketing to
            you
          </li>
          <li>third parties to collect and process data</li>
          <li>
            an entity that buys, or to which we transfer all or substantially
            all of our assets and business
          </li>
        </TypographyUList>
        <TypographyP>Third parties we currently use include: </TypographyP>
        <TypographyUList>
          <li>Paypal</li>
          <li>Cloudflare</li>
          <li>Discord</li>
        </TypographyUList>
        <TypographyH2>
          Your Rights and Controlling Your Personal Information
        </TypographyH2>
        <TypographyP>
          <strong>Your choice:</strong> By providing personal information to us,
          you understand we will collect, hold, use, and disclose your personal
          information in accordance with this privacy policy. You do not have to
          provide personal information to us, however, if you do not, it may
          affect your use of our website or the products and/or services offered
          on or through it.{" "}
        </TypographyP>
        <TypographyP>
          <strong>Information from third parties:</strong> If we receive
          personal information about you from a third party, we will protect it
          as set out in this privacy policy. If you are a third party providing
          personal information about somebody else, you represent and warrant
          that you have such person’s consent to provide the personal
          information to us.{" "}
        </TypographyP>
        <TypographyP>
          <strong>Marketing permission:</strong> If you have previously agreed
          to us using your personal information for direct marketing purposes,
          you may change your mind at any time by contacting us using the
          details below.{" "}
        </TypographyP>
        <TypographyP>
          <strong>Access:</strong> You may request details of the personal
          information that we hold about you.{" "}
        </TypographyP>
        <TypographyP>
          <strong>Correction:</strong> If you believe that any information we
          hold about you is inaccurate, out of date, incomplete, irrelevant, or
          misleading, please contact us using the details provided in this
          privacy policy. We will take reasonable steps to correct any
          information found to be inaccurate, incomplete, misleading, or out of
          date.{" "}
        </TypographyP>
        <TypographyP>
          <strong>Non-discrimination:</strong> We will not discriminate against
          you for exercising any of your rights over your personal information.
          Unless your personal information is required to provide you with a
          particular service or offer (for example providing user support), we
          will not deny you goods or services and/or charge you different prices
          or rates for goods or services, including through granting discounts
          or other benefits, or imposing penalties, or provide you with a
          different level or quality of goods or services.{" "}
        </TypographyP>
        <TypographyP>
          <strong>Notification of data breaches:</strong> We will comply with
          laws applicable to us in respect of any data breach.{" "}
        </TypographyP>
        <TypographyP>
          <strong>Complaints:</strong> If you believe that we have breached a
          relevant data protection law and wish to make a complaint, please
          contact us using the details below and provide us with full details of
          the alleged breach. We will promptly investigate your complaint and
          respond to you, in writing, setting out the outcome of our
          investigation and the steps we will take to deal with your complaint.
          You also have the right to contact a regulatory body or data
          protection authority in relation to your complaint.{" "}
        </TypographyP>
        <TypographyP>
          <strong>Unsubscribe:</strong> To unsubscribe from our email database
          or opt-out of communications (including marketing communications),
          please contact us using the details provided in this privacy policy,
          or opt-out using the opt-out facilities provided in the communication.
          We may need to request specific information from you to help us
          confirm your identity.{" "}
        </TypographyP>
        <TypographyH2>Use of Cookies</TypographyH2>
        <TypographyP>
          We use &ldquo;cookies&rdquo; to collect information about you and your
          activity across our site. A cookie is a small piece of data that our
          website stores on your computer, and accesses each time you visit, so
          we can understand how you use our site. This helps us serve you
          content based on preferences you have specified.{" "}
        </TypographyP>
        <TypographyP>
          Please refer to our Cookie Policy for more information.{" "}
        </TypographyP>
        <TypographyH2>Business Transfers</TypographyH2>
        <TypographyP>
          If we or our assets are acquired, or in the unlikely event that we go
          out of business or enter bankruptcy, we would include data, including
          your personal information, among the assets transferred to any parties
          who acquire us. You acknowledge that such transfers may occur, and
          that any parties who acquire us may, to the extent permitted by
          applicable law, continue to use your personal information according to
          this policy, which they will be required to assume as it is the basis
          for any ownership or use rights we have over such information.{" "}
        </TypographyP>
        <TypographyH2>Limits of Our Policy</TypographyH2>
        <TypographyP>
          Our website may link to external sites that are not operated by us.
          Please be aware that we have no control over the content and policies
          of those sites, and cannot accept responsibility or liability for
          their respective privacy practices.{" "}
        </TypographyP>
        <TypographyH2>Changes to This Policy</TypographyH2>
        <TypographyP>
          At our discretion, we may change our privacy policy to reflect updates
          to our business processes, current acceptable practices, or
          legislative or regulatory changes. If we decide to change this privacy
          policy, we will post the changes here at the same link by which you
          are accessing this privacy policy.{" "}
        </TypographyP>
        <TypographyP>
          If the changes are significant, or if required by applicable law, we
          will contact you (based on your selected preferences for
          communications from us) and all our registered users with the new
          details and links to the updated or changed policy.{" "}
        </TypographyP>
        <TypographyP>
          If required by law, we will get your permission or give you the
          opportunity to opt in to or opt out of, as applicable, any new uses of
          your personal information.{" "}
        </TypographyP>
        <TypographyH2>
          Additional Disclosures for Australian Privacy Act Compliance (AU)
        </TypographyH2>
        <TypographyH4>
          International Transfers of Personal Information
        </TypographyH4>
        <TypographyP>
          Where the disclosure of your personal information is solely subject to
          Australian privacy laws, you acknowledge that some third parties may
          not be regulated by the Privacy Act and the Australian Privacy
          Principles in the Privacy Act. You acknowledge that if any such third
          party engages in any act or practice that contravenes the Australian
          Privacy Principles, it would not be accountable under the Privacy Act,
          and you will not be able to seek redress under the Privacy Act.{" "}
        </TypographyP>
        <TypographyH2>
          Additional Disclosures for General Data Protection Regulation (GDPR)
          Compliance (EU)
        </TypographyH2>
        <TypographyH4>Data Controller / Data Processor</TypographyH4>
        <TypographyP>
          The GDPR distinguishes between organisations that process personal
          information for their own purposes (known as &ldquo;data
          controllers&rdquo;) and organizations that process personal
          information on behalf of other organizations (known as &ldquo;data
          processors&rdquo;). We, Member Counter, located at the address
          provided in our Contact Us section, are a Data Controller with respect
          to the personal information you provide to us.{" "}
        </TypographyP>
        <TypographyH4>
          Legal Bases for Processing Your Personal Information
        </TypographyH4>
        <TypographyP>
          We will only collect and use your personal information when we have a
          legal right to do so. In which case, we will collect and use your
          personal information lawfully, fairly, and in a transparent manner. If
          we seek your consent to process your personal information, and you are
          under 16 years of age, we will seek your parent or legal guardian’s
          consent to process your personal information for that specific
          purpose.{" "}
        </TypographyP>
        <TypographyP>
          Our lawful bases depend on the services you use and how you use them.
          This means we only collect and use your information on the following
          grounds:{" "}
        </TypographyP>
        <h5>Consent From You</h5>
        <TypographyP>
          Where you give us consent to collect and use your personal information
          for a specific purpose. You may withdraw your consent at any time
          using the facilities we provide; however this will not affect any use
          of your information that has already taken place. When you contact us,
          you may consent to your name and email address being used so we can
          respond to your enquiry. While you may request that we delete your
          contact details at any time, we cannot recall any email we have
          already sent. If you have any further enquiries about how to withdraw
          your consent, please feel free to enquire using the details provided
          in the Contact Us section of this privacy policy.{" "}
        </TypographyP>
        <h5>Performance of a Contract or Transaction</h5>
        <TypographyP>
          Where you have entered into a contract or transaction with us, or in
          order to take preparatory steps prior to our entering into a contract
          or transaction with you. For example, if you contact us with an
          enquiry, we may require personal information such as your name and
          contact details in order to respond.{" "}
        </TypographyP>
        <h5>Our Legitimate Interests</h5>
        <TypographyP>
          Where we assess it is necessary for our legitimate interests, such as
          for us to provide, operate, improve and communicate our services. We
          consider our legitimate interests to include research and development,
          understanding our audience, marketing and promoting our services,
          measures taken to operate our services efficiently, marketing
          analysis, and measures taken to protect our legal rights and
          interests.{" "}
        </TypographyP>
        <h5>Compliance with Law</h5>
        <TypographyP>
          In some cases, we may have a legal obligation to use or keep your
          personal information. Such cases may include (but are not limited to)
          court orders, criminal investigations, government requests, and
          regulatory obligations. If you have any further enquiries about how we
          retain personal information in order to comply with the law, please
          feel free to enquire using the details provided in the Contact Us
          section of this privacy policy.{" "}
        </TypographyP>
        <TypographyH4>
          International Transfers Outside of the European Economic Area (EEA)
        </TypographyH4>
        <TypographyP>
          We will ensure that any transfer of personal information from
          countries in the European Economic Area (EEA) to countries outside the
          EEA will be protected by appropriate safeguards, for example by using
          standard data protection clauses approved by the European Commission,
          or the use of binding corporate rules or other legally accepted means.{" "}
        </TypographyP>
        <TypographyH4>
          Your Rights and Controlling Your Personal Information
        </TypographyH4>
        <TypographyP>
          <strong>Restrict:</strong> You have the right to request that we
          restrict the processing of your personal information if (i) you are
          concerned about the accuracy of your personal information; (ii) you
          believe your personal information has been unlawfully processed; (iii)
          you need us to maintain the personal information solely for the
          purpose of a legal claim; or (iv) we are in the process of considering
          your objection in relation to processing on the basis of legitimate
          interests.{" "}
        </TypographyP>
        <TypographyP>
          <strong>Objecting to processing:</strong> You have the right to object
          to processing of your personal information that is based on our
          legitimate interests or public interest. If this is done, we must
          provide compelling legitimate grounds for the processing which
          overrides your interests, rights, and freedoms, in order to proceed
          with the processing of your personal information.{" "}
        </TypographyP>
        <TypographyP>
          <strong>Data portability:</strong> You may have the right to request a
          copy of the personal information we hold about you. Where possible, we
          will provide this information in CSV format or other easily readable
          machine format. You may also have the right to request that we
          transfer this personal information to a third party.{" "}
        </TypographyP>
        <TypographyP>
          <strong>Deletion:</strong> You may have a right to request that we
          delete the personal information we hold about you at any time, and we
          will take reasonable steps to delete your personal information from
          our current records. If you ask us to delete your personal
          information, we will let you know how the deletion affects your use of
          our website or products and services. There may be exceptions to this
          right for specific legal reasons which, if applicable, we will set out
          for you in response to your request. Please be aware that search
          engines and similar third parties may still retain copies of your
          personal information that has been made public at least once, like
          certain profile information and public comments, even after you have
          deleted the information from our services or deactivated your account.{" "}
        </TypographyP>
        <TypographyH2>
          Additional Disclosures for California Compliance (US)
        </TypographyH2>
        <TypographyP>
          Under California Civil Code Section 1798.83, if you live in California
          and your business relationship with us is mainly for personal, family,
          or household purposes, you may ask us about the information we release
          to other organizations for their marketing purposes.{" "}
        </TypographyP>
        <TypographyP>
          To make such a request, please contact us using the details provided
          in this privacy policy with &ldquo;Request for California privacy
          information&rdquo; in the subject line. You may make this type of
          request once every calendar year. We will email you a list of
          categories of personal information we revealed to other organisations
          for their marketing purposes in the last calendar year, along with
          their names and addresses. Not all personal information shared in this
          way is covered by Section 1798.83 of the California Civil Code.{" "}
        </TypographyP>
        <TypographyH4>Do Not Track</TypographyH4>
        <TypographyP>
          Some browsers have a &ldquo;Do Not Track&rdquo; feature that lets you
          tell websites that you do not want to have your online activities
          tracked. At this time, we do not respond to browser &ldquo;Do Not
          Track&rdquo; signals.{" "}
        </TypographyP>
        <TypographyP>
          We adhere to the standards outlined in this privacy policy, ensuring
          we collect and process personal information lawfully, fairly,
          transparently, and with legitimate, legal reasons for doing so.{" "}
        </TypographyP>
        <TypographyH4>Cookies and Pixels</TypographyH4>
        <TypographyP>
          At all times, you may decline cookies from our site if your browser
          permits. Most browsers allow you to activate settings on your browser
          to refuse the setting of all or some cookies. Accordingly, your
          ability to limit cookies is based only on your browser’s capabilities.
          Please refer to the Cookies section of this privacy policy for more
          information.{" "}
        </TypographyP>
        <TypographyH4>CCPA-permitted financial incentives</TypographyH4>
        <TypographyP>
          In accordance with your right to non-discrimination, we may offer you
          certain financial incentives permitted by the CCPA that can result in
          different prices, rates, or quality levels for the goods or services
          we provide.{" "}
        </TypographyP>
        <TypographyP>
          Any CCPA-permitted financial incentive we offer will reasonably relate
          to the value of your personal information, and we will provide written
          terms that describe clearly the nature of such an offer. Participation
          in a financial incentive program requires your prior opt-in consent,
          which you may revoke at any time.{" "}
        </TypographyP>
        <TypographyH4>California Notice of Collection</TypographyH4>
        <TypographyP>
          In the past 12 months, we have collected the following categories of
          personal information enumerated in the California Consumer Privacy
          Act:{" "}
        </TypographyP>
        <TypographyUList>
          <li>
            Customer records, such as billing and shipping address, and credit
            or debit card data.
          </li>
        </TypographyUList>
        <TypographyP>
          For more information on information we collect, including the sources
          we receive information from, review the &ldquo;Information We
          Collect&rdquo; section. We collect and use these categories of
          personal information for the business purposes described in the
          &ldquo;Collection and Use of Information&rdquo; section, including to
          provide and manage our Service.{" "}
        </TypographyP>
        <TypographyH4>Right to Know and Delete</TypographyH4>
        <TypographyP>
          If you are a California resident, you have rights to delete your
          personal information we collected and know certain information about
          our data practices in the preceding 12 months. In particular, you have
          the right to request the following from us:{" "}
        </TypographyP>
        <TypographyUList>
          <li>
            The categories of personal information we have collected about you;
          </li>
          <li>
            The categories of sources from which the personal information was
            collected;
          </li>
          <li>
            The categories of personal information about you we disclosed for a
            business purpose or sold;
          </li>
          <li>
            The categories of third parties to whom the personal information was
            disclosed for a business purpose or sold;
          </li>
          <li>
            The business or commercial purpose for collecting or selling the
            personal information; and
          </li>
          <li>
            The specific pieces of personal information we have collected about
            you.
          </li>
        </TypographyUList>
        <TypographyP>
          To exercise any of these rights, please contact us using the details
          provided in this privacy policy.{" "}
        </TypographyP>
        <TypographyH4>Shine the Light</TypographyH4>
        <TypographyP>
          If you are a California resident, in addition to the rights discussed
          above, you have the right to request information from us regarding the
          manner in which we share certain personal information as defined by
          California’s &ldquo;Shine the Light&rdquo; with third parties and
          affiliates for their own direct marketing purposes.{" "}
        </TypographyP>
        <TypographyP>
          To receive this information, send us a request using the contact
          details provided in this privacy policy. Requests must include
          &ldquo;California Privacy Rights Request&rdquo; in the first line of
          the description and include your name, street address, city, state,
          and ZIP code.{" "}
        </TypographyP>
        <TypographyH2>Contact Us</TypographyH2>
        <TypographyP>
          For any questions or concerns regarding your privacy, you may contact
          us at{" "}
          <LinkUnderlined href="mailto:eduardozgz@protonmail.com">
            eduardozgz@protonmail.com
          </LinkUnderlined>
        </TypographyP>
      </>
    ),
  },
  "cookie-policy": {
    title: "Cookie Policy",
    page: (
      <>
        <TypographyP>
          We use cookies to help improve your experience of our website at{" "}
          <LinkUnderlined href="https://member-counter.eduardozgz.com">
            https://member-counter.eduardozgz.com
          </LinkUnderlined>
          . This cookie policy is part of Member Counter&#39;s privacy policy.
          It covers the use of cookies between your device and our site{" "}
        </TypographyP>
        <TypographyP>
          We also provide basic information on third-party services we may use,
          who may also use cookies as part of their service. This policy does
          not cover their cookies, however, you can check them in their cookie
          policy sites:
        </TypographyP>
        <TypographyUList>
          <li>
            <LinkUnderlined href="https://www.cloudflare.com/cookie-policy/">
              Cloudflare
            </LinkUnderlined>
          </li>

          <li>
            <LinkUnderlined href="https://www.paypal.com/uk/webapps/mpp/ua/cookie-full">
              Paypal
            </LinkUnderlined>
          </li>
        </TypographyUList>
        <TypographyP>
          If you don’t wish to accept cookies from us, you should instruct your
          browser to refuse cookies from{" "}
          <LinkUnderlined href="https://member-counter.eduardozgz.com">
            https://member-counter.eduardozgz.com
          </LinkUnderlined>
          . In such a case, we may be unable to provide you with some of your
          desired content and services.{" "}
        </TypographyP>
        <TypographyH2>What is a cookie?</TypographyH2>
        <TypographyP>
          A cookie is a small piece of data that a website stores on your device
          when you visit. It typically contains information about the website
          itself, a unique identifier that allows the site to recognize your web
          browser when you return, additional data that serves the cookie’s
          purpose, and the lifespan of the cookie itself.{" "}
        </TypographyP>
        <TypographyP>
          Cookies are used to enable certain features (e.g. logging in), track
          site usage (e.g. analytics), store your user settings (e.g. time zone,
          notification preferences), and to personalize your content (e.g.
          advertising, language).{" "}
        </TypographyP>
        <TypographyP>
          Cookies set by the website you are visiting are usually referred to as
          first-party cookies. They typically only track your activity on that
          particular site.{" "}
        </TypographyP>
        <TypographyP>
          Cookies set by other sites and companies (i.e. third parties) are
          called third-party cookies They can be used to track you on other
          websites that use the same third-party service.{" "}
        </TypographyP>
        <TypographyH2>Types of cookies and how we use them</TypographyH2>
        <TypographyH4>Essential cookies</TypographyH4>
        <TypographyP>
          Essential cookies are crucial to your experience of a website,
          enabling core features like user logins, account management, shopping
          carts, and payment processing.{" "}
        </TypographyP>
        <TypographyP>
          {" "}
          We use essential cookies to enable certain functions on our website.{" "}
        </TypographyP>
        <TypographyH4>Performance cookies</TypographyH4>
        <TypographyP>
          Performance cookies track how you use a website during your visit.
          Typically, this information is anonymous and aggregated, with
          information tracked across all site users. They help companies
          understand visitor usage patterns, identify and diagnose problems or
          errors their users may encounter, and make better strategic decisions
          in improving their audience’s overall website experience. These
          cookies may be set by the website you’re visiting (first-party) or by
          third-party services. They do not collect personal information about
          you.{" "}
        </TypographyP>
        <TypographyP>
          We do not use this type of cookie on our site.{" "}
        </TypographyP>
        <TypographyH4>Functionality cookies</TypographyH4>
        <TypographyP>
          Functionality cookies are used to collect information about your
          device and any settings you may configure on the website you’re
          visiting (like language and time zone settings). With this
          information, websites can provide you with customized, enhanced, or
          optimized content and services. These cookies may be set by the
          website you’re visiting (first-party) or by third-party services.{" "}
        </TypographyP>
        <TypographyP>
          We do not use this type of cookie on our site.{" "}
        </TypographyP>
        <TypographyH4>Targeting/advertising cookies</TypographyH4>
        <TypographyP>
          Targeting/advertising cookies help determine what promotional content
          is most relevant and appropriate to you and your interests. Websites
          may use them to deliver targeted advertising or limit the number of
          times you see an advertisement. This helps companies improve the
          effectiveness of their campaigns and the quality of content presented
          to you. These cookies may be set by the website you’re visiting
          (first-party) or by third-party services. Targeting/advertising
          cookies set by third-parties may be used to track you on other
          websites that use the same third-party service.{" "}
        </TypographyP>
        <TypographyP>
          We do not use this type of cookie on our site.{" "}
        </TypographyP>
      </>
    ),
  },
  "acceptable-use-policy": {
    title: "Acceptable Use Policy",
    page: (
      <>
        <TypographyP>
          This acceptable use policy covers the products, services, and
          technologies (collectively referred to as the &ldquo;Products&rdquo;)
          provided by Member Counter under any ongoing agreement. It’s designed
          to protect us, our customers, and the general Internet community from
          unethical, irresponsible, and illegal activity.{" "}
        </TypographyP>
        <TypographyP>
          Member Counter customers found engaging in activities prohibited by
          this acceptable use policy can be liable for service suspension and
          account termination. In extreme cases, we may be legally obliged to
          report such customers to the relevant authorities.{" "}
        </TypographyP>
        <TypographyP>
          This policy was last reviewed on 1 October 2021.{" "}
        </TypographyP>
        <TypographyH2>Fair use</TypographyH2>
        <TypographyP>
          We provide our facilities with the assumption your use will be
          &ldquo;business as usual&rdquo;, as per our offer schedule. If your
          use is considered to be excessive, then additional fees may be
          charged, or capacity may be restricted.{" "}
        </TypographyP>
        <TypographyP>
          We are opposed to all forms of abuse, discrimination, rights
          infringement, and/or any action that harms or disadvantages any group,
          individual, or resource. We expect our customers and, where
          applicable, their users (&ldquo;end-users&rdquo;) to likewise engage
          our Products with similar intent.{" "}
        </TypographyP>
        <TypographyH2>Customer accountability</TypographyH2>
        <TypographyP>
          We regard our customers as being responsible for their own actions as
          well as for the actions of anyone using our Products with the
          customer’s permission. This responsibility also applies to anyone
          using our Products on an unauthorized basis as a result of the
          customer’s failure to put in place reasonable security measures.{" "}
        </TypographyP>
        <TypographyP>
          By accepting Products from us, our customers agree to ensure adherence
          to this policy on behalf of anyone using the Products as their end
          users. Complaints regarding the actions of customers or their
          end-users will be forwarded to the nominated contact for the account
          in question.{" "}
        </TypographyP>
        <TypographyP>
          If a customer — or their end-user or anyone using our Products as a
          result of the customer — violates our acceptable use policy, we
          reserve the right to terminate any Products associated with the
          offending account or the account itself or take any remedial or
          preventative action we deem appropriate, without notice. To the extent
          permitted by law, no credit will be available for interruptions of
          service resulting from any violation of our acceptable use policy.{" "}
        </TypographyP>
        <TypographyH2>Prohibited activity</TypographyH2>
        <TypographyH4>
          Copyright infringement and access to unauthorized material
        </TypographyH4>
        <TypographyP>
          Our Products must not be used to transmit, distribute or store any
          material in violation of any applicable law. This includes but isn’t
          limited to:{" "}
        </TypographyP>
        <TypographyOList type="i">
          <li>
            any material protected by copyright, trademark, trade secret, or
            other intellectual property right used without proper authorization,
            and
          </li>
          <li>
            any material that is obscene, defamatory, constitutes an illegal
            threat or violates export control laws.
          </li>
        </TypographyOList>
        <TypographyP>
          The customer is solely responsible for all material they input,
          upload, disseminate, transmit, create or publish through or on our
          Products, and for obtaining legal permission to use any works included
          in such material.{" "}
        </TypographyP>
        <TypographyH4>SPAM and unauthorized message activity</TypographyH4>
        <TypographyP>
          Our Products must not be used for the purpose of sending unsolicited
          bulk or commercial messages in violation of the laws and regulations
          applicable to your jurisdiction (“spam”). This includes but isn’t
          limited to sending spam, soliciting customers from spam sent from
          other service providers, and collecting replies to spam sent from
          other service providers.{" "}
        </TypographyP>
        <TypographyP>
          Our Products must not be used for the purpose of running unconfirmed
          mailing lists or telephone number lists (&ldquo;messaging
          lists&rdquo;). This includes but isn’t limited to subscribing email
          addresses or telephone numbers to any messaging list without the
          permission of the email address or telephone number owner, and storing
          any email addresses or telephone numbers subscribed in this way. All
          messaging lists run on or hosted by our Products must be
          &ldquo;confirmed opt-in&rdquo;. Verification of the address or
          telephone number owner’s express permission must be available for the
          lifespan of the messaging list.{" "}
        </TypographyP>
        <TypographyP>
          We prohibit the use of email lists, telephone number lists or
          databases purchased from third parties intended for spam or
          unconfirmed messaging list purposes on our Products.{" "}
        </TypographyP>
        <TypographyP>
          This spam and unauthorized message activity policy applies to messages
          sent using our Products, or to messages sent from any network by the
          customer or any person on the customer’s behalf, that directly or
          indirectly refer the recipient to a site hosted via our Products.{" "}
        </TypographyP>
        <TypographyH4>
          Unethical, exploitative, and malicious activity
        </TypographyH4>
        <TypographyP>
          Our Products must not be used for the purpose of advertising,
          transmitting, or otherwise making available any software, program,
          product, or service designed to violate this acceptable use policy, or
          the acceptable use policy of other service providers. This includes
          but isn’t limited to facilitating the means to send spam and the
          initiation of network sniffing, pinging, packet spoofing, flooding,
          mail-bombing, and denial-of-service attacks.{" "}
        </TypographyP>
        <TypographyP>
          Our Products must not be used to access any account or electronic
          resource where the group or individual attempting to gain access does
          not own or is not authorized to access the resource (e.g.
          &ldquo;hacking&rdquo;, &ldquo;cracking&rdquo;,
          &ldquo;phreaking&rdquo;, etc.).{" "}
        </TypographyP>
        <TypographyP>
          Our Products must not be used for the purpose of intentionally or
          recklessly introducing viruses or malicious code into our Products and
          systems.{" "}
        </TypographyP>
        <TypographyP>
          Our Products must not be used for purposely engaging in activities
          designed to harass another group or individual. Our definition of
          harassment includes but is not limited to denial-of-service attacks,
          hate-speech, advocacy of racial or ethnic intolerance, and any
          activity intended to threaten, abuse, infringe upon the rights of, or
          discriminate against any group or individual.{" "}
        </TypographyP>
        <TypographyP>
          Other activities considered unethical, exploitative, and malicious
          include:{" "}
        </TypographyP>
        <TypographyOList>
          <li>
            Obtaining (or attempting to obtain) services from us with the intent
            to avoid payment;
          </li>
          <li>
            Using our facilities to obtain (or attempt to obtain) services from
            another provider with the intent to avoid payment;
          </li>
          <li>
            The unauthorized access, alteration, or destruction (or any attempt
            thereof) of any information about our customers or end-users, by any
            means or device;
          </li>
          <li>
            Using our facilities to interfere with the use of our facilities and
            network by other customers or authorized individuals;
          </li>
          <li>
            Publishing or transmitting any content of links that incite
            violence, depict a violent act, depict child pornography, or
            threaten anyone’s health and safety;
          </li>
          <li>
            Any act or omission in violation of consumer protection laws and
            regulations;
          </li>
          <li>Any violation of a person’s privacy.</li>
        </TypographyOList>
        <TypographyP>
          Our Products may not be used by any person or entity, which is
          involved with or suspected of involvement in activities or causes
          relating to illegal gambling; terrorism; narcotics trafficking; arms
          trafficking or the proliferation, development, design, manufacture,
          production, stockpiling, or use of nuclear, chemical or biological
          weapons, weapons of mass destruction, or missiles; in each case
          including any affiliation with others whatsoever who support the above
          such activities or causes.{" "}
        </TypographyP>
        <TypographyH4>Unauthorized use of Member Counter property</TypographyH4>
        <TypographyP>
          We prohibit the impersonation of Member Counter, the representation of
          a significant business relationship with Member Counter, or ownership
          of any Member Counter property (including our Products and brand) for
          the purpose of fraudulently gaining service, custom, patronage, or
          user trust.{" "}
        </TypographyP>
        <TypographyH2>About this policy</TypographyH2>
        <TypographyP>
          This policy outlines a non-exclusive list of activities and intent we
          deem unacceptable and incompatible with our brand.{" "}
        </TypographyP>
        <TypographyP>
          We reserve the right to modify this policy at any time by publishing
          the revised version on our website. The revised version will be
          effective from the earlier of:{" "}
        </TypographyP>
        <TypographyUList>
          <li>
            the date the customer uses our Products after we publish the revised
            version on our website; or
          </li>
          <li>30 days after we publish the revised version on our website.</li>
        </TypographyUList>
      </>
    ),
  },
};

interface Props {
  params: { legalPage: [string] | undefined };
}

export function generateMetadata({ params }: Props): Metadata {
  let requestedSlug: LegalPageSlugs | null = null;

  try {
    requestedSlug = z.enum(legalPageSlugs).parse(params.legalPage?.[0]);
  } catch {
    requestedSlug = "terms-of-service";
  }

  const legalPage = legalPages[requestedSlug];

  return {
    title: legalPage.title + " - Member Counter",
  };
}

export default function Page({ params }: Props) {
  let requestedSlug: LegalPageSlugs | null = null;

  try {
    requestedSlug = z.enum(legalPageSlugs).parse(params.legalPage?.[0]);
  } catch {
    /* empty */
  }

  if (!requestedSlug) redirect("/legal/terms-of-service", RedirectType.replace);

  return (
    <>
      <Tabs
        defaultValue={requestedSlug}
        className="m-auto my-2 w-[750px] break-words"
      >
        <div className="flex flex-col gap-2">
          <TabListWrapper />
          {Object.entries(legalPages).map(([slug, { title, page }]) => (
            <TabsContent value={slug}>
              <Card className="rounded-md">
                <CardHeader>
                  <CardTitle>
                    <TypographyH1>{title}</TypographyH1>
                  </CardTitle>
                </CardHeader>
                <CardContent>{page}</CardContent>
              </Card>
            </TabsContent>
          ))}
          <TabListWrapper />
        </div>
      </Tabs>
      <Footer />
    </>
  );
}

function TabListWrapper() {
  return (
    <TabsList className="grid w-full grid-cols-4">
      <Link href="./terms-of-service">
        <TabsTrigger value="terms-of-service" className="w-full">
          Terms of Service
        </TabsTrigger>
      </Link>
      <Link href="./privacy-policy">
        <TabsTrigger value="privacy-policy" className="w-full">
          Privacy Policy
        </TabsTrigger>
      </Link>
      <Link href="./cookie-policy">
        <TabsTrigger value="cookie-policy" className="w-full">
          Cookie Policy
        </TabsTrigger>
      </Link>
      <Link href="./acceptable-use-policy">
        <TabsTrigger value="acceptable-use-policy" className="w-full">
          Acceptable Use Policy
        </TabsTrigger>
      </Link>
    </TabsList>
  );
}
