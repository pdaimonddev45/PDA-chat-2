import React, { createContext, useContext, useState, useEffect } from "react";

export type PlanType = "free" | "premium";

export interface Allowances {
  image_generation: number;
  image_editing: number;
  video_generation: number;
  video_editing: number;
  music_generation: number;
}

interface SubscriptionContextType {
  plan: PlanType;
  setPlan: (plan: PlanType) => void;
  allowances: Allowances;
  decrementAllowance: (
    feature: keyof Allowances
  ) => boolean;
  resetAllowances: () => void;
  isUpgradeModalOpen: boolean;
  setIsUpgradeModalOpen: (open: boolean) => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined
);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [plan, setPlanState] = useState<PlanType>(() => {
    const saved = localStorage.getItem("pda_plan");
    return (saved as PlanType) || "free";
  });

  const [allowances, setAllowances] = useState<Allowances>(() => {
    const saved = localStorage.getItem("pda_allowances");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // use default
      }
    }
    return {
      image_generation: 10,
      image_editing: 10,
      video_generation: 10,
      video_editing: 10,
      music_generation: 10,
    };
  });

  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("pda_plan", plan);
  }, [plan]);

  useEffect(() => {
    localStorage.setItem("pda_allowances", JSON.stringify(allowances));
  }, [allowances]);

  const setPlan = (newPlan: PlanType) => {
    setPlanState(newPlan);
  };

  const decrementAllowance = (feature: keyof Allowances): boolean => {
    if (plan === "premium") {
      return true; // Uncapped for premium
    }

    let isSuccess = false;
    setAllowances((prev) => {
      if (prev[feature] <= 0) {
        setIsUpgradeModalOpen(true);
        isSuccess = false;
        return prev;
      }
      isSuccess = true;
      return {
        ...prev,
        [feature]: prev[feature] - 1,
      };
    });

    return isSuccess;
  };

  const resetAllowances = () => {
    setAllowances({
      image_generation: 10,
      image_editing: 10,
      video_generation: 10,
      video_editing: 10,
      music_generation: 10,
    });
  };

  return (
    <SubscriptionContext.Provider
      value={{
        plan,
        setPlan,
        allowances,
        decrementAllowance,
        resetAllowances,
        isUpgradeModalOpen,
        setIsUpgradeModalOpen,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error(
      "useSubscription must be used within a SubscriptionProvider"
    );
  }
  return context;
};
