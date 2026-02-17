import Link from "next/link";
import { Icon } from "@iconify/react";

export const metadata = {
  title: "Terms of Service | Spraada",
  description:
    "Terms of Service for Spraada - the peer-to-peer tool rental platform",
};

export default function TermsOfService() {
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
              Terms of Service
            </h1>
            <p className="text-gray-600 text-lg">Last updated: February 2026</p>
            <p className="text-gray-500 mt-4">
              Please read these terms carefully before using Spraada.
            </p>
          </div>

          {/* Content */}
          <div className="space-y-8 text-gray-700">
            {/* 1. Agreement to Terms */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                1. Agreement to Terms
              </h2>
              <p>
                By accessing and using Spraada ("the Platform"), you accept and
                agree to be bound by the terms and provision of this agreement.
                If you do not agree to abide by the above, please do not use
                this service.
              </p>
              <p className="mt-4">
                Spraada reserves the right to update and change these Terms of
                Service from time to time without notice. Your continued use of
                the Platform following the posting of revised Terms means that
                you accept and agree to the changes.
              </p>
            </section>

            {/* 2. Use License */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                2. Use License
              </h2>
              <p>
                Permission is granted to temporarily download one copy of the
                materials (information or software) on Spraada for personal,
                non-commercial transitory viewing only. This is the grant of a
                license, not a transfer of title, and under this license you may
                not:
              </p>
              <ul className="mt-4 space-y-2 ml-4">
                <li className="flex items-start">
                  <span className="text-primary-500 font-bold mr-3">•</span>
                  <span>Modifying or copying the materials or content</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 font-bold mr-3">•</span>
                  <span>
                    Using the materials for any commercial purpose or for any
                    public display
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 font-bold mr-3">•</span>
                  <span>
                    Attempting to decompile or reverse engineer any software
                    contained on the Platform
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 font-bold mr-3">•</span>
                  <span>
                    Removing any copyright or other proprietary notations from
                    the materials
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 font-bold mr-3">•</span>
                  <span>
                    Transferring the materials to another person or "mirroring"
                    the materials on any other server
                  </span>
                </li>
              </ul>
            </section>

            {/* 3. User Accounts */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                3. User Accounts
              </h2>
              <p>
                To access certain features of Spraada, you must create a user
                account. You agree to:
              </p>
              <ul className="mt-4 space-y-2 ml-4">
                <li className="flex items-start">
                  <span className="text-primary-500 font-bold mr-3">•</span>
                  <span>
                    Provide accurate, current, and complete information during
                    registration
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 font-bold mr-3">•</span>
                  <span>
                    Maintain the confidentiality of your password and account
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 font-bold mr-3">•</span>
                  <span>
                    Accept responsibility for all activities that occur under
                    your account
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 font-bold mr-3">•</span>
                  <span>
                    Notify us immediately of any unauthorized use of your
                    account
                  </span>
                </li>
              </ul>
            </section>

            {/* 4. Tool Listings */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                4. Tool Listings and Rentals
              </h2>
              <p>Users who list tools for rent on Spraada agree to:</p>
              <ul className="mt-4 space-y-2 ml-4">
                <li className="flex items-start">
                  <span className="text-primary-500 font-bold mr-3">•</span>
                  <span>
                    Provide accurate descriptions and images of their tools
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 font-bold mr-3">•</span>
                  <span>
                    Ensure tools are in the condition described at the time of
                    rental
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 font-bold mr-3">•</span>
                  <span>
                    Accept rental requests and honor agreed-upon rental terms
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 font-bold mr-3">•</span>
                  <span>
                    Maintain appropriate insurance coverage for valuable tools
                  </span>
                </li>
              </ul>
              <p className="mt-4">Renters agree to:</p>
              <ul className="mt-4 space-y-2 ml-4">
                <li className="flex items-start">
                  <span className="text-primary-500 font-bold mr-3">•</span>
                  <span>
                    Use tools responsibly and in accordance with their intended
                    purpose
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 font-bold mr-3">•</span>
                  <span>
                    Return tools in the same condition as received (normal wear
                    and tear excepted)
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 font-bold mr-3">•</span>
                  <span>Pay all rental fees and charges as agreed</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 font-bold mr-3">•</span>
                  <span>
                    Report any damage or loss immediately to the tool owner
                  </span>
                </li>
              </ul>
            </section>

            {/* 5. Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                5. Limitation of Liability
              </h2>
              <p>
                The materials on Spraada are provided "as is." Spraada makes no
                warranties, expressed or implied, and hereby disclaims and
                negates all other warranties including, without limitation,
                implied warranties or conditions of merchantability, fitness for
                a particular purpose, or non-infringement of intellectual
                property or other violation of rights.
              </p>
              <p className="mt-4">
                Further, Spraada does not warrant or make any representations
                concerning the accuracy, likely results, or reliability of the
                use of the materials on its Platform or otherwise relating to
                such materials or on any sites linked to the Platform.
              </p>
            </section>

            {/* 6. Limitations on Liability */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                6. Limitations on Liability
              </h2>
              <p>
                In no event shall Spraada or its suppliers be liable for any
                damages (including, without limitation, damages for loss of data
                or profit, or due to business interruption) arising out of the
                use or inability to use the materials on Spraada, even if
                Spraada or an authorized representative has been notified orally
                or in writing of the possibility of such damage.
              </p>
            </section>

            {/* 7. Accuracy of Materials */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                7. Accuracy of Materials
              </h2>
              <p>
                The materials appearing on Spraada could include technical,
                typographical, or photographic errors. Spraada does not warrant
                that any of the materials on the Platform are accurate,
                complete, or current. Spraada may make changes to the materials
                contained on the Platform at any time without notice.
              </p>
            </section>

            {/* 8. Materials on Linked Sites */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                8. Disputes and Damage Claims
              </h2>
              <p>
                Users acknowledge that disputes may arise regarding tool
                condition, rental terms, or damages. Spraada provides a dispute
                resolution process for users to address conflicts. Spraada is
                not liable for disputes between users but will attempt to
                facilitate resolution through our platform.
              </p>
              <p className="mt-4">
                Tool owners and renters are responsible for resolving disputes
                regarding damage claims, missing items, or other grievances. We
                recommend documenting the tool condition with photos before and
                after rentals.
              </p>
            </section>

            {/* 9. Prohibited Activities */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                9. Prohibited Activities
              </h2>
              <p>Users agree not to use Spraada for:</p>
              <ul className="mt-4 space-y-2 ml-4">
                <li className="flex items-start">
                  <span className="text-primary-500 font-bold mr-3">•</span>
                  <span>
                    Illegal purposes or in violation of any applicable laws
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 font-bold mr-3">•</span>
                  <span>Harassment, abuse, or threats toward other users</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 font-bold mr-3">•</span>
                  <span>Posting fraudulent or misleading information</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 font-bold mr-3">•</span>
                  <span>
                    Attempting to gain unauthorized access to our systems
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 font-bold mr-3">•</span>
                  <span>Infringing on intellectual property rights</span>
                </li>
              </ul>
            </section>

            {/* 10. Disclaimer of Warranties */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                10. Disclaimer of Warranties
              </h2>
              <p>
                The use of materials, tools, and services on Spraada is at your
                own risk. Spraada disclaims all warranties of any kind, whether
                express or implied, relating to the condition or fitness of any
                tools listed on the Platform.
              </p>
            </section>

            {/* 11. Termination */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                11. Termination
              </h2>
              <p>
                Spraada may terminate or suspend your account and access to the
                Platform immediately, without prior notice or liability, for any
                reason whatsoever, including if you breach the Terms.
              </p>
            </section>

            {/* 12. Governing Law */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                12. Governing Law
              </h2>
              <p>
                The materials appearing on Spraada are governed by and construed
                in accordance with the laws of the jurisdiction in which Spraada
                operates, and you irrevocably submit to the exclusive
                jurisdiction of the courts in that location.
              </p>
            </section>

            {/* 13. Contact Information */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                13. Contact Information
              </h2>
              <p>
                If you have any questions about these Terms of Service, please
                contact us at:
              </p>
              <div className="mt-4 p-4 bg-primary-50 rounded-lg border border-primary-200">
                <p className="font-semibold text-gray-900">Spraada Support</p>
                <p className="text-gray-600 mt-2">Email: support@spraada.com</p>
                <p className="text-gray-600">Website: www.spraada.com</p>
              </div>
            </section>

            {/* Footer */}
            <section className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                © 2026 Spraada. All rights reserved. These Terms of Service
                constitute the entire agreement between you and Spraada
                regarding your use of the Platform.
              </p>
              <div className="mt-6 flex gap-6 text-sm">
                <Link
                  href="/privacy-policy"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Privacy Policy
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
