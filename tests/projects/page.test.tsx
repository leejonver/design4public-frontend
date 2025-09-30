import { describe, it, expect } from "vitest";
import { render, screen } from "../utils/test-utils";

vi.mock("../../app/projects/projects-grid", () => ({
  ProjectsGrid: () => <div data-testid="projects-grid" />,
}));

const loadPage = () => import("../../app/projects/page").then((mod) => mod.default);

describe("Projects page", () => {
  it("renders heading and nested grid", async () => {
    const ProjectsListPage = await loadPage();
    render(<ProjectsListPage />);
    expect(screen.getByRole("heading", { name: "Projects" })).toBeInTheDocument();
    expect(screen.getByTestId("projects-grid")).toBeInTheDocument();
  });
});
