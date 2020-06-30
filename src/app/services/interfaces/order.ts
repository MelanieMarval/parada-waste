export interface Order {
    begin_at: any;
    billing_name: string;
    business_name: string;
    cancel_at: any;
    cancel_note: string;
    client_id: number;
    contact_name: string;
    contact_note: string;
    contact_phone: string;
    container?: {
        capacity: string;
        code: string;
        created_at: any;
        id: number;
        last_location_id: any;
        last_order_id: any;
        last_status: string;
        name: string;
        serial: string;
        status: string;
    };
    container_id: number;
    container_rental_days: number;
    container_status_begin?: any;
    container_status_end?: any;
    created_at: string;
    dayslate: number;
    delivery_location?: {
        address_text: string;
        created_at: any;
        id: number;
        lat: number;
        lon: number;
        name: string;
        status: string;
        user_id: number;
    };
    delivery_location_id: number;
    driver_id: number;
    dryrandays: number;
    end_at?: any;
    id: number;
    invoice: string;
    location_begin?: {
        address_text: string;
        created_at: any;
        id: number;
        lat: number;
        lon: number;
        name: string;
        status: string;
        user_id: number;
    };
    location_begin_id: number;
    location_end?: {
        address_text: string;
        created_at: any;
        id: number;
        lat: number;
        lon: number;
        name: string;
        status: string;
        user_id: number;
    };
    location_end_id: number;
    milleage_begin?: any;
    milleage_end?: any;
    notify: string;
    office_location?: {
        address_text: string;
        created_at: any;
        id: number;
        lat: number;
        lon: number;
        name: string;
        status: string;
        user_id: number;
    };
    office_location_id: number;
    order: string;
    reasigned_at: any;
    reasigned_driver_id?: any;
    reasigned_vehicle_id?: any;
    scheduled_at: any;
    status: string;
    type: string;
    user_id: number;
    vehicle?: {
        brand: string;
        capacity: string;
        created_at: any;
        id: number;
        model: string;
        number: string;
        serial: string;
        status: string;
    };
    vehicle_id: number;
}