import { describe, it, expect } from "vitest";
import React from "react";
import {
  Skeleton,
  SkeletonText,
  SkeletonCircle,
  SkeletonBadge,
  SkeletonStatCard,
  SkeletonTable,
} from "../../src/components/shared/Skeleton";

describe("Skeleton Components", () => {
  it("exporte les composants de Skeleton sans erreur", () => {
    expect(Skeleton).toBeDefined();
    expect(SkeletonText).toBeDefined();
    expect(SkeletonCircle).toBeDefined();
    expect(SkeletonBadge).toBeDefined();
    expect(SkeletonStatCard).toBeDefined();
    expect(SkeletonTable).toBeDefined();
  });

  it("génère les éléments React attendus", () => {
    const s = React.createElement(Skeleton, { className: "custom-class" });
    expect(s.type).toBe(Skeleton);
    expect(s.props.className).toBe("custom-class");

    const statCard = React.createElement(SkeletonStatCard);
    expect(statCard.type).toBe(SkeletonStatCard);

    const table = React.createElement(SkeletonTable, { rows: 4, columns: 3 });
    expect(table.type).toBe(SkeletonTable);
    expect(table.props.rows).toBe(4);
  });
});
