import googleMaps from 'google-maps';

export const initMap = (containerId = "map", options = {}) => {
    googleMaps.load(google => new google.maps.Map(
        document.getElementById(containerId),
        options
    ))
}