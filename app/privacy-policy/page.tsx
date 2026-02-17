import Link from "next/link";
import { Icon } from "@iconify/react";

export const metadata = {
  title: "Privacy Policy | Spraada",
  description:
    "Privacy Policy for Spraada - the peer-to-peer tool rental platform",
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-linear-to-b from-primary-50 to-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold group"
          >
            <Icon
              icon="mdi:arrow-left"
              width={20}
              height={20}
              className="mr-2 group-hover:-translate-x-1 transition-transform"
            />
            Back to Spraada
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-sm sm:prose max-w-none">
          {/* Title */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Privacy Policy
            </h1>
            <p className="text-gray-600 text-lg">Last updated: February 2026</p>
            <p className="text-gray-500 mt-4">
              Your privacy is important to us. Please read this policy
              carefully.
            </p>
          </div>

          {/* Content */}
          <div className="space-y-8 text-gray-700">
            {/* 1. Introduction */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                1. Introduction
              </h2>
              <p>
                Spraada ("Company," "we," or "us") is committed to protecting
                your privacy. This Privacy Policy explains how we collect, use,
                disclose, and safeguard your information when you visit our
                website and use our services.
              </p>
              <p className="mt-4">
                Please read this Privacy Policy carefully. If you do not agree
                with our policies and practices, please do not use our Platform.
              </p>
            </section>

            {/* 2. Information We Collect */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                2. Information We Collect
              </h2>
              <p>
                We may collect information about you in a variety of ways. The
                information we may collect on the Platform includes:
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                Personal Data
              </h3>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start">
                  <span className="text-primary-500 font-bold mr-3">•</span>
                  <span>Email address</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 font-bold mr-3">•</span>
                  <span>First and last name</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 font-bold mr-3">•</span>
                  <span>Phone number</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 font-bold mr-3">•</span>
                  <span>Address and location data</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 font-bold mr-3">•</span>
                  <span>User profile information (bio, avatar)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 font-bold mr-3">•</span>
                  <span>Payment and billing information</span>
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                Automatically Collected Information
              </h3>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start">
                  <span className="text-primary-500 font-bold mr-3">•</span>
                  <span>Device information (IP address, browser type)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 font-bold mr-3">•</span>
                  <span>Usage data (pages viewed, time spent)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 font-bold mr-3">•</span>
                  <span>Cookies and similar tracking technologies</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 font-bold mr-3">•</span>
                  <span>Location data (when permitted)</span>
                </li>
              </ul>
            </section>

            {/* 3. Use of Your Information */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                3. Use of Your Information
              </h2>
              <p>
                Having accurate information about you permits us to provide you
                with a smooth, efficient, and customized experience.
                Specifically, we may use information collected about you via the
                Platform to:
              </p>
              <ul className="mt-4 space-y-2 ml-4">
                <li className="flex items-start">
                  <span className="text-primary-500 font-bold mr-3">•</span>
                  <span>Create and manage your account</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 font-bold mr-3">•</span>
                  <span>
                    Process your transactions and send related information
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 font-bold mr-3">•</span>
                  <span>
                    Email you regarding your account or rental activity
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 font-bold mr-3">•</span>
                  <span>Fulfill and manage your requests and orders</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 font-bold mr-3">•</span>
                  <span>Generate a personal profile about you</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 font-bold mr-3">•</span>
                  <span>
                    Increase the efficiency and operation of the Platform
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 font-bold mr-3">•</span>
                  <span>
                    Monitor and analyze usage and trends to improve your
                    experience
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 font-bold mr-3">•</span>
                  <span>Notify you of updates to the Platform</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 font-bold mr-3">•</span>
                  <span>Allow you to participate in interactive features</span>
                </li>
              </ul>
            </section>

            {/* 4. Disclosure of Your Information */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                4. Disclosure of Your Information
              </h2>
              <p>
                We may share information we have collected about you in certain
                situations:
              </p>
              <ul className="mt-4 space-y-2 ml-4">
                <li className="flex items-start">
                  <span className="text-primary-500 font-bold mr-3">•</span>
                  <span>
                    <strong>By Law or to Protect Rights:</strong> If required by
                    law or if we have a good faith belief that disclosure is
                    necessary
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 font-bold mr-3">•</span>
                  <span>
                    <strong>Third-Party Service Providers:</strong> We may share
                    your information with vendors, consultants, and other
                    service providers
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 font-bold mr-3">•</span>
                  <span>
                    <strong>Other Users:</strong> For rental transactions, the
                    other party will have access to relevant rental information
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 font-bold mr-3">•</span>
                  <span>
                    <strong>Business Transfers:</strong> If Spraada is involved
                    in a merger or acquisition, your information may be
                    transferred
                  </span>
                </li>
              </ul>
            </section>

            {/* 5. Security of Your Information */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                5. Security of Your Information
              </h2>
              <p>
                We use administrative, technical, and physical security measures
                to protect your personal information. However, no method of
                transmission over the Internet or method of electronic storage
                is 100% secure. While we strive to use commercially acceptable
                means to protect your personal information, we cannot guarantee
                its absolute security.
              </p>
              <p className="mt-4">
                You are responsible for maintaining the confidentiality of your
                account credentials. If you believe your account has been
                compromised, please contact us immediately.
              </p>
            </section>

            {/* 6. Contact Information */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                6. Your Privacy Rights
              </h2>
              <p>
                Depending on your location, you may have certain rights
                regarding your personal information, including:
              </p>
              <ul className="mt-4 space-y-2 ml-4">
                <li className="flex items-start">
                  <span className="text-primary-500 font-bold mr-3">•</span>
                  <span>The right to access your personal information</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 font-bold mr-3">•</span>
                  <span>The right to correct inaccurate data</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 font-bold mr-3">•</span>
                  <span>The right to request deletion of your data</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 font-bold mr-3">•</span>
                  <span>The right to opt-out of marketing communications</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 font-bold mr-3">•</span>
                  <span>The right to data portability</span>
                </li>
              </ul>
            </section>

            {/* 7. Cookies and Tracking */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                7. Cookies and Tracking Technologies
              </h2>
              <p>
                We use cookies and similar tracking technologies to track
                activity on our Platform and store certain information. Cookies
                are files with a small amount of data that may include an
                anonymous unique identifier.
              </p>
              <p className="mt-4">
                You can instruct your browser to refuse all cookies or to
                indicate when a cookie is being sent. However, if you do not
                accept cookies, you may not be able to use some portions of our
                Platform.
              </p>
            </section>

            {/* 8. Third-Party Links */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                8. Third-Party Links
              </h2>
              <p>
                The Platform may contain links to third-party websites that are
                not operated by us. This Privacy Policy does not apply to these
                third-party websites, and we are not responsible for their
                privacy practices. We encourage you to review the privacy
                policies of any third-party sites before providing your
                information.
              </p>
            </section>

            {/* 9. Children's Privacy */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                9. Children's Privacy
              </h2>
              <p>
                Spraada is not intended for children under 18 years of age. We
                do not knowingly collect personal information from children
                under 18. If we become aware that a child has provided us with
                personal information, we will delete such information and
                terminate the child's account immediately.
              </p>
            </section>

            {/* 10. Policy Changes */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                10. Changes to This Privacy Policy
              </h2>
              <p>
                We may update this Privacy Policy from time to time in order to
                reflect, for example, changes to our practices or for other
                operational, legal, or regulatory reasons. Your continued use of
                the Platform following the posting of revised Privacy Policy
                means that you accept and agree to the changes.
              </p>
            </section>

            {/* 11. Contact Us */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                11. Contact Us
              </h2>
              <p>
                If you have questions or comments about this Privacy Policy,
                please contact us at:
              </p>
              <div className="mt-4 p-4 bg-primary-50 rounded-lg border border-primary-200">
                <p className="font-semibold text-gray-900">
                  Spraada Privacy Team
                </p>
                <p className="text-gray-600 mt-2">Email: privacy@spraada.com</p>
                <p className="text-gray-600">Website: www.spraada.com</p>
                <p className="text-gray-600">
                  Mailing Address: Spraada Inc., 24209 Kampala, Uganda
                </p>
              </div>
            </section>

            {/* Footer */}
            <section className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                © 2026 Spraada. All rights reserved. We are committed to
                protecting your privacy and ensuring you have a positive
                experience on our Platform.
              </p>
              <div className="mt-6 flex gap-6 text-sm">
                <Link
                  href="/terms"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Terms of Service
                </Link>
                <Link
                  href="/"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Home
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
