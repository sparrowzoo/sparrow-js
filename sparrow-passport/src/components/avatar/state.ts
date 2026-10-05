import { Position } from "@/components/ui/avatar-editor";

export default interface AvatarState {
  clickable: boolean;
  image: string;
  allowZoomOut: boolean;
  position: Position;
  scale: number;
  rotate: number;
  borderRadius: number;
  preview?: {
    img: string;
    rect: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    scale: number;
    width: number;
    height: number;
    borderRadius: number;
  };
  width: number;
  height: number;
  disableCanvasRotation: boolean;
  isTransparent: boolean;
  backgroundColor?: string;
  showGrid: boolean;
  borderColor: string;
}

export const initialState: AvatarState = {
  image: "/avatar.jpg",
  clickable: false,
  allowZoomOut: false,
  position: { x: 0.5, y: 0.5 },
  scale: 1,
  rotate: 0,
  borderRadius: 0,
  preview: undefined,
  width: 200,
  height: 200,
  disableCanvasRotation: false,
  isTransparent: true,
  backgroundColor: undefined,
  showGrid: true,
  borderColor: "#ffffff80", // Default border color (white with 50% opacity)
};
