'use strict';

//TODO: Should this be called every time this app is loaded?
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js').
    then(registration => {
      console.log(
        'service worker registration succeeded with scope',
        registration.scope);
    }).
    catch(error => {
      console.error('failed to register service worker:', error);
    });
}

const KILOMETERS_PER_MILE = 3.609;
const MILES_PER_KILOMETERS = 0.6214;

let distanceSelect, paceInput, timeInput;

function calculatePace() {
  const time = timeInput.value;
  const distance = distanceSelect.value;
  paceInput.value = getMilePaceTime(parseFloat(distance, 10), time);
}

function convertKilometersToMiles(kilometers) {
  return kilometers * MILES_PER_KILOMETERS;
}

function convertMilesToKilometers(miles) {
  return miles * KILOMETERS_PER_MILE;
}

function convertTimeToSeconds(time) {
  const pieces = time.split(':').map(piece => parseInt(piece, 10));
  if (pieces.length === 2) {
    pieces.unshift(0);
  } else if (pieces.length !== 3) {
    throw new Error(time + ' is not a valid time');
  }

  const [hours, minutes, seconds] = pieces;
  return (hours * 60 + minutes) * 60 + seconds;
}

function getKilometerPaceTime(kilometers, time) {
  return getMilePaceTime(kilometers, time);
}

function getMilePaceTime(miles, time) {
  const seconds = convertTimeToSeconds(time);
  const secondsPerMile = seconds / miles;
  const minutesPerMile = secondsPerMile / 60;
  const wholeMinutesPerMile = Math.floor(minutesPerMile);
  const wholeSecondsPerMile =
    Math.round((minutesPerMile - wholeMinutesPerMile) * 60);
  let pace = wholeMinutesPerMile + ':';
  if (wholeSecondsPerMile < 10) pace += '0';
  pace += wholeSecondsPerMile;
  return pace;
}

window.onload = () => {
  distanceSelect = document.getElementById('distance');
  timeInput = document.getElementById('time');
  paceInput = document.getElementById('pace');
};
