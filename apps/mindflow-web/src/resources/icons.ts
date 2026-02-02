import { IconType } from "react-icons";

import {
    HiOutlinePencilSquare,
    HiOutlineChartBar,
    HiOutlineLightBulb,
    HiOutlineCog6Tooth,
    HiOutlineCalendar,
    HiOutlineSparkles,
    HiOutlineHome,
    HiOutlinePlusCircle,
    HiOutlineMoon,
    HiOutlineSun,
    HiOutlineArrowLeft,
    HiOutlineArrowRight,
    HiOutlineFaceSmile,
    HiOutlineFaceFrown,
} from "react-icons/hi2";

import { PiUserCircleDuotone } from "react-icons/pi";

export const iconLibrary: Record<string, IconType> = {
    home: HiOutlineHome,
    journal: HiOutlinePencilSquare,
    analytics: HiOutlineChartBar,
    insights: HiOutlineLightBulb,
    settings: HiOutlineCog6Tooth,
    calendar: HiOutlineCalendar,
    ai: HiOutlineSparkles,
    add: HiOutlinePlusCircle,
    moon: HiOutlineMoon,
    sun: HiOutlineSun,
    arrowLeft: HiOutlineArrowLeft,
    arrowRight: HiOutlineArrowRight,
    happy: HiOutlineFaceSmile,
    sad: HiOutlineFaceFrown,
    neutral: PiUserCircleDuotone,
};

export type IconLibrary = typeof iconLibrary;
export type IconName = keyof IconLibrary;
