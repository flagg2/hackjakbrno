import Link from "next/link";
import { GiHealthNormal } from "react-icons/gi";
import DocumentInfo from "./document-info";

type HeaderProps = {
  fileId?: string;
};

export default function Header({ fileId }: HeaderProps) {
  return (
    <header className="bg-accent border-b">
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <GiHealthNormal className="h-6 w-6 text-primary" />
              <div className="ml-2 text-xl font-bold text-foreground">
                Perfect Pump
              </div>
            </Link>
          </div>
          {/* <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="/"
                className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
              >
                Charts
              </Link>
            </div>
          </div> */}
          <DocumentInfo fileId={fileId} />
        </div>
      </div>
    </header>
  );
}
