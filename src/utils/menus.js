
import { RIGHTS_MAPPING } from './utilConstants';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import PersonIcon from '@mui/icons-material/Person';

export const menus = [

    {
        id: 1,
        parentId: null,
        name: "Mese",
        to: "/dashboard/boards",
        icon: RestaurantIcon,
        isCategory: false,
        excludelocationsType: [],
        rights: [RIGHTS_MAPPING.WAITER, RIGHTS_MAPPING.MANAGER],
        order: 90,
        children: [

        ]
    },

    {
        id: 2,
        parentId: null,
        name: "Comenzi",
        to: "/dashboard/orders",
        icon: AccessTimeIcon,
        isCategory: false,
        excludelocationsType: [],
        rights: [RIGHTS_MAPPING.WAITER, RIGHTS_MAPPING.MANAGER, RIGHTS_MAPPING.CHEF],
        order: 90,
        children: [

        ]
    },
    {
        id: 3,
        parentId: null,
        name: "Meniu",
        to: "/dashboard/products",
        icon: RestaurantMenuIcon,
        isCategory: false,
        excludelocationsType: [],
        rights: [RIGHTS_MAPPING.MANAGER],
        order: 90,
        children: [

        ]
    },
    {
        id: 4,
        parentId: null,
        name: "Statistici",
        to: "/dashboard/statistics",
        icon: AnalyticsIcon,
        isCategory: false,
        excludelocationsType: [],
        rights: [RIGHTS_MAPPING.MANAGER],
        order: 90,
        children: [

        ]
    },
    {
        id: 5,
        parentId: null,
        name: "Comenzi finalizate",
        to: "/dashboard/finishedOrders",
        icon: CheckCircleOutlineIcon,
        isCategory: false,
        excludelocationsType: [],
        rights: [RIGHTS_MAPPING.WAITER, RIGHTS_MAPPING.MANAGER, RIGHTS_MAPPING.CHEF],
        order: 90,
        children: [

        ]
    },
    {
        id: 6,
        parentId: null,
        name: "Utilizatori",
        to: "/dashboard/users",
        icon: PersonIcon,
        isCategory: false,
        excludelocationsType: [],
        rights: [RIGHTS_MAPPING.MANAGER],
        order: 90,
        children: [

        ]
    }

]
