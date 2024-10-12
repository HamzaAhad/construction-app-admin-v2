import {
  FaHome,
  FaUser,
  FaSignOutAlt,
  FaUpload,
  FaSearch,
  FaExclamationCircle,
  FaCalendarAlt,
  FaTicketAlt,
  FaFileAlt,
} from "react-icons/fa";
import { IoMdKey } from "react-icons/io";

export const Items = [
  {
    name: "",
    link: "",
    icon: "",
  },
  {
    name: "",
    link: "",
    icon: "",
  },
  {
    name: "Dashboard",
    link: "/dashboard",
    icon: FaHome,
  },
  {
    name: "Manage Inspection",
    link: "/issues",
    icon: FaExclamationCircle,
  },
  {
    name: "Manage Events",
    link: "/events",
    icon: FaCalendarAlt,
  },
  {
    name: "Manage Sites",
    link: "/sites",
    icon: FaCalendarAlt,
  },
  {
    name: "Inspection Category",
    link: "/category",
    icon: FaSearch,
  },
  {
    name: "Manage Employee",
    link: "/employee",
    icon: FaUser,
  },
  {
    name: "Manage Import",
    link: "/import",
    icon: FaUpload,
  },
  {
    name: "Manage Roles",
    link: "/roles",
    icon: IoMdKey,
  },
  {
    name: "Manage Tickets",
    link: "/tickets",
    icon: FaTicketAlt,
  },
  {
    name: "System Logs",
    link: "/system-logs",
    icon: FaFileAlt,
  },
  {
    name: "Logout",
    link: "/login",
    icon: FaSignOutAlt,
  },
];
