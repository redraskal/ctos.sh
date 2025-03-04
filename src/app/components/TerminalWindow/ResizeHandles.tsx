export function ResizeHandles({
  handleResizeStart,
}: {
  handleResizeStart: (e: React.MouseEvent, direction: string) => void;
}) {
  return (
    <>
      <div
        className="absolute -right-1 -bottom-1 w-4 h-4 cursor-se-resize z-50"
        onMouseDown={(e) => handleResizeStart(e, 'se')}
      />
      <div
        className="absolute -left-1 -bottom-1 w-4 h-4 cursor-sw-resize z-50"
        onMouseDown={(e) => handleResizeStart(e, 'sw')}
      />
      <div
        className="absolute -right-1 -top-1 w-4 h-4 cursor-ne-resize z-50"
        onMouseDown={(e) => handleResizeStart(e, 'ne')}
      />
      <div
        className="absolute -left-1 -top-1 w-4 h-4 cursor-nw-resize z-50"
        onMouseDown={(e) => handleResizeStart(e, 'nw')}
      />
      <div
        className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-8 cursor-e-resize z-50"
        onMouseDown={(e) => handleResizeStart(e, 'e')}
      />
      <div
        className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-8 cursor-w-resize z-50"
        onMouseDown={(e) => handleResizeStart(e, 'w')}
      />
      <div
        className="absolute top-[-1px] left-1/2 -translate-x-1/2 h-2 w-8 cursor-n-resize z-50"
        onMouseDown={(e) => handleResizeStart(e, 'n')}
      />
      <div
        className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-2 w-8 cursor-s-resize z-50"
        onMouseDown={(e) => handleResizeStart(e, 's')}
      />
    </>
  );
}
