import { renderHook, act } from "@testing-library/react";
import { useAlertActions } from "./useAlertActions";

describe("useAlertActions", () => {
  it("starts with both dialogs closed", () => {
    const { result } = renderHook(() => useAlertActions());
    expect(result.current.isResolveOpen).toBe(false);
    expect(result.current.isAssignOpen).toBe(false);
  });

  it("openResolve opens resolve dialog and closes assign", () => {
    const { result } = renderHook(() => useAlertActions());
    act(() => {
      result.current.openAssign();
    });
    act(() => {
      result.current.openResolve();
    });
    expect(result.current.isResolveOpen).toBe(true);
    expect(result.current.isAssignOpen).toBe(false);
  });

  it("openAssign opens assign dialog and closes resolve", () => {
    const { result } = renderHook(() => useAlertActions());
    act(() => {
      result.current.openResolve();
    });
    act(() => {
      result.current.openAssign();
    });
    expect(result.current.isAssignOpen).toBe(true);
    expect(result.current.isResolveOpen).toBe(false);
  });

  it("closeAll closes both dialogs", () => {
    const { result } = renderHook(() => useAlertActions());
    act(() => {
      result.current.openResolve();
    });
    act(() => {
      result.current.closeAll();
    });
    expect(result.current.isResolveOpen).toBe(false);
    expect(result.current.isAssignOpen).toBe(false);
  });
});
