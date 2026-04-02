"use client";

import { useMemo, useState } from "react";
import PainelPatrocinadoresCobranca from "@/components/patrocinadores/painel-patrocinadores-cobranca";
import type {
  PatrocinadorLike,
  PatrocinadorStatus,
} from "@/lib/patrocinadores";
import {
  updatePatrocinadorCobrancaAction,
  updatePatrocinadorStatusAction,
} from "@/app/patrocinadores-painel/actions";

type Props = {
  items: PatrocinadorLike[];
};

type ActionResult = {
  ok?: boolean;
  error?: string;
  message?: string;
  sponsor?: Record<string, unknown> | null;
};

export default function PatrocinadoresPainelClient({ items }: Props) {
  const [savingId, setSavingId] = useState<string | null>(null);
  const [localItems, setLocalItems] = useState<PatrocinadorLike[]>(items);

  const normalizedItems = useMemo(() => {
    return localItems.map((item) => ({
      ...item,
      id: String(item.id ?? ""),
    }));
  }, [localItems]);

  function updateLocalItem(
    sponsorId: string,
    patch: Partial<PatrocinadorLike>,
  ) {
    setLocalItems((current) =>
      current.map((currentItem) => {
        if (String(currentItem.id ?? "") !== sponsorId) {
          return currentItem;
        }

        return {
          ...currentItem,
          ...patch,
        };
      }),
    );
  }

  async function handleSaveStatus(
    item: PatrocinadorLike,
    nextStatus: PatrocinadorStatus,
  ) {
    const sponsorId = String(item.id ?? "").trim();

    if (!sponsorId) {
      throw new Error("ID do patrocinador não encontrado.");
    }

    setSavingId(sponsorId);

    try {
      const result = (await updatePatrocinadorStatusAction(
        sponsorId,
        nextStatus,
      )) as ActionResult;

      if (!result?.ok) {
        throw new Error(
          result?.error ||
            result?.message ||
            "Não foi possível atualizar o status comercial.",
        );
      }

      const sponsor = result?.sponsor ?? null;

      updateLocalItem(sponsorId, {
        status: String(sponsor?.status ?? nextStatus) || nextStatus,
        commercial_status: String(sponsor?.status ?? nextStatus) || nextStatus,
        payment_status:
          sponsor && typeof sponsor.payment_status === "string"
            ? sponsor.payment_status
            : nextStatus === "aguardando_pagamento"
              ? "waiting"
              : nextStatus === "pago" || nextStatus === "ativo"
                ? "paid"
                : item.payment_status ?? null,
        updated_at:
          typeof sponsor?.updated_at === "string"
            ? sponsor.updated_at
            : new Date().toISOString(),
      });
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error("Falha ao salvar status comercial.");
    } finally {
      setSavingId(null);
    }
  }

  async function handleSaveAsaasLink(
    item: PatrocinadorLike,
    asaasLink: string,
  ) {
    const sponsorId = String(item.id ?? "").trim();

    if (!sponsorId) {
      throw new Error("ID do patrocinador não encontrado.");
    }

    setSavingId(sponsorId);

    try {
      const result = (await updatePatrocinadorCobrancaAction(
        sponsorId,
        asaasLink,
      )) as ActionResult;

      if (!result?.ok) {
        throw new Error(
          result?.error ||
            result?.message ||
            "Não foi possível salvar o link de cobrança.",
        );
      }

      const sponsor = result?.sponsor ?? null;

      updateLocalItem(sponsorId, {
        asaas_payment_link:
          typeof sponsor?.asaas_payment_link === "string"
            ? sponsor.asaas_payment_link
            : asaasLink,
        payment_link:
          typeof sponsor?.payment_link === "string"
            ? sponsor.payment_link
            : asaasLink,
        updated_at:
          typeof sponsor?.updated_at === "string"
            ? sponsor.updated_at
            : new Date().toISOString(),
      });
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error("Falha ao salvar link de cobrança.");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <PainelPatrocinadoresCobranca
      items={normalizedItems}
      savingId={savingId}
      onSaveStatus={handleSaveStatus}
      onSaveAsaasLink={handleSaveAsaasLink}
      title="Painel comercial"
      description="Controle de aceite, evolução de status e cobrança do patrocinador. Sistema em constante atualização e pode haver momentos de instabilidade durante melhorias."
    />
  );
}