// By Lat/Long GET https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=AIzaSyDaOXn2lSkZaJyXZSz0xglhT74yc_F2p4U
// By Zip code GET https://maps.googleapis.com/maps/api/geocode/json?address=60134&key=AIzaSyDaOXn2lSkZaJyXZSz0xglhT74yc_F2p4U
// Google Maps Key AIzaSyDaOXn2lSkZaJyXZSz0xglhT74yc_F2p4U
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

export interface GeoCoordinate {
  lat: number;
  lng: number;
}

interface GoogleGeocodeItem {
  long_name: string;
  short_name: string;
  types: string[];
}

export interface GoogleGeoLocation {
  street?: string | null;
  city: string | null;
  state: string | null;
  zipcode: string | null;
  zipcode_suffix?: string | null;
  lat?: number | null;
  lng?: number | null;
}

const googleApi = axios.create({
  baseURL: 'https://maps.googleapis.com/maps/api'
});

function parseGoogleGeocodeResponse(google: any) {
  const { address_components: response, geometry } = google;

  const defaultResult: GoogleGeoLocation = {
    street: null,
    city: null,
    state: null,
    zipcode: null,
    zipcode_suffix: null
  };

  if (google && google.length) {
    const location = google.reduce(
      (result: GoogleGeoLocation, item: GoogleGeocodeItem) => {
        if (item.types.indexOf('postal_code') !== -1) {
          result.zipcode = item.long_name;
        } else if (item.types.indexOf('route') !== -1) {
          result.street = item.long_name;
        } else if (item.types.indexOf('locality') !== -1) {
          result.city = item.long_name;
        } else if (item.types.indexOf('administrative_area_level_1') !== -1) {
          result.state = item.short_name;
        } else if (item.types.indexOf('postal_code_suffix') !== -1) {
          result.zipcode_suffix = item.long_name;
        }
        return result;
      },
      defaultResult
    );

    if (geometry) {
      location.lat = geometry.location.lat;
      location.lng = geometry.location.lng;
    }

    return location;
  }
}

class GoogleMapsService {
  private apiKey: string;
  private debug: boolean = false;

  constructor(apiKey: string, debug: boolean = false) {
    this.apiKey = apiKey;
  }

  private query = async (config: AxiosRequestConfig) => {
    return googleApi(config);
  }

  geocodeByZipCode = async (zipcode?: string) => {
    try {
      if (zipcode && zipcode.length >= 5) {
        const response: AxiosResponse = await this.query({
          url: '/geocode/json',
          params: {
            key: this.apiKey,
            address: zipcode
          }
        });

        if (response.data.status === 'OK') {
          const { results } = response.data;
          return parseGoogleGeocodeResponse(results[0].address_components);
        }
      }
    } catch (error) {
      console.warn(error);
    }
    return undefined;
  }

  geocodeByLatLng = async (coordinate: GeoCoordinate) => {
    try {
      if (coordinate) {
        const { lat, lng } = coordinate;

        const response: AxiosResponse = await this.query({
          url: '/geocode/json',
          params: {
            key: this.apiKey,
            latlng: `${lat},${lng}`
          }
        });

        if (response.data.status === 'OK') {
          const { results } = response.data;
          return parseGoogleGeocodeResponse(results[0]);
        }
      }
    } catch (error) {
      console.warn(error);
    }
    return undefined;
  }
}

export default new GoogleMapsService('AIzaSyDaOXn2lSkZaJyXZSz0xglhT74yc_F2p4U');
