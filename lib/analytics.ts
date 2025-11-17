declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams);
  }

  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...eventParams
    });
  }
};

export const trackPageView = (pagePath: string, pageTitle?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-WE779B9V0E', {
      page_path: pagePath,
      page_title: pageTitle
    });
  }

  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'page_view',
      page_path: pagePath,
      page_title: pageTitle
    });
  }
};

export const trackConversion = (conversionType: string, value?: number, currency: string = 'USD') => {
  trackEvent('conversion', {
    conversion_type: conversionType,
    value: value,
    currency: currency
  });

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      send_to: 'G-WE779B9V0E',
      value: value,
      currency: currency
    });
  }
};

export const trackSearchFlight = (params: {
  from: string;
  to: string;
  departDate: string;
  returnDate?: string;
  passengers: number;
  tripType: string;
}) => {
  trackEvent('search_flight', {
    from: params.from,
    to: params.to,
    depart_date: params.departDate,
    return_date: params.returnDate,
    passengers: params.passengers,
    trip_type: params.tripType
  });
};

export const trackPhoneClick = (phoneNumber: string) => {
  trackEvent('phone_click', {
    phone_number: phoneNumber,
    event_category: 'engagement',
    event_label: 'Call Button Click'
  });

  trackConversion('phone_call_click');
};

export const trackFormSubmit = (formName: string) => {
  trackEvent('form_submit', {
    form_name: formName,
    event_category: 'engagement',
    event_label: `${formName} Form Submitted`
  });

  trackConversion('form_submission');
};

export const trackBookingStart = () => {
  trackEvent('begin_checkout', {
    event_category: 'ecommerce',
    event_label: 'Booking Started'
  });
};

export const trackBookingComplete = (bookingDetails: {
  bookingId?: string;
  totalAmount?: number;
  currency?: string;
  from?: string;
  to?: string;
}) => {
  trackEvent('purchase', {
    transaction_id: bookingDetails.bookingId,
    value: bookingDetails.totalAmount,
    currency: bookingDetails.currency || 'USD',
    from: bookingDetails.from,
    to: bookingDetails.to
  });

  trackConversion('booking_complete', bookingDetails.totalAmount, bookingDetails.currency);
};

export const trackButtonClick = (buttonName: string, location?: string) => {
  trackEvent('button_click', {
    button_name: buttonName,
    location: location,
    event_category: 'engagement'
  });
};

export const trackAIAssistantInteraction = (action: string) => {
  trackEvent('ai_assistant_interaction', {
    action: action,
    event_category: 'engagement',
    event_label: 'AI Assistant'
  });
};
