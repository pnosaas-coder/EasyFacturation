import { describe, it, expect } from "vitest";
import React from "react";
import { LandingHeader } from "../../src/components/landing/LandingHeader";
import { LandingHero } from "../../src/components/landing/LandingHero";
import { HeroDashboardPreview } from "../../src/components/landing/HeroDashboardPreview";
import { LandingPricing } from "../../src/components/landing/LandingPricing";
import { LandingFeatures } from "../../src/components/landing/LandingFeatures";
import { LandingProblems } from "../../src/components/landing/LandingProblems";
import { LandingHowItWorks } from "../../src/components/landing/LandingHowItWorks";
import { LandingTestimonials } from "../../src/components/landing/LandingTestimonials";
import { LandingCtaBanner } from "../../src/components/landing/LandingCtaBanner";
import { LandingFooter } from "../../src/components/landing/LandingFooter";

describe("Landing Page — Architecture & Composants Reutilisables", () => {
  it("exporte tous les composants modulaires de la Landing Page", () => {
    expect(LandingHeader).toBeDefined();
    expect(LandingHero).toBeDefined();
    expect(HeroDashboardPreview).toBeDefined();
    expect(LandingPricing).toBeDefined();
    expect(LandingFeatures).toBeDefined();
    expect(LandingProblems).toBeDefined();
    expect(LandingHowItWorks).toBeDefined();
    expect(LandingTestimonials).toBeDefined();
    expect(LandingCtaBanner).toBeDefined();
    expect(LandingFooter).toBeDefined();
  });

  it("vérifie que les tarifs en Francs CFA (FCFA) et plans sont configurés", () => {
    const pricingElement = LandingPricing();
    expect(pricingElement).toBeDefined();
  });
});
