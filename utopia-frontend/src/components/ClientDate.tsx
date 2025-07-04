"use client";

import { formatDate } from "@/lib/utils";

interface ClientDateProps {
  date: Date | string;
}

export const ClientDate: React.FC<ClientDateProps> = ({ date }) => {
  return <span>{formatDate(new Date(date))}</span>;
};
