import Image from "next/image";
import { ASSETS } from "@/lib/config";

const logoWidths = {
  home: { condusef: 63, sipres: 116 },
  footer: { condusef: 66, sipres: 122 },
  table: { condusef: 73, sipres: 135 },
  contract: { condusef: 38, sipres: 71 },
} as const;

type VerificationLogosVariant = keyof typeof logoWidths;

type VerificationLogosProps = {
  variant?: VerificationLogosVariant;
};

export function VerificationLogos({ variant = "home" }: VerificationLogosProps) {
  const widths = logoWidths[variant];

  return (
    <>
      <Image
        src={ASSETS.condusef}
        alt="CONDUSEF"
        width={80}
        height={46}
        style={{ width: `${widths.condusef}px`, height: "auto" }}
      />
      <Image
        src={ASSETS.sipres}
        alt="SIPRES"
        width={129}
        height={40}
        style={{ width: `${widths.sipres}px`, height: "auto" }}
      />
    </>
  );
}
