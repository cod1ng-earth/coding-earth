<?php
namespace App\Util;

class Location
{
    /**
     * geo:39.569451,2.649946
     * @param $apLocation
     *
     * @return array
     */
    public static function extractAppleStructuredLocation(string $apLocation): array {
        $parts = explode(':', $apLocation);
        $ll = explode(',', $parts[1]);
        return [
            'lat' => (float)$ll[0],
            'lon' => (float)$ll[1]
        ];
    }
}