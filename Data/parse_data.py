#
# Author: Neel Mehta
# Date: 19 November 2016
#

import json
from numpy.random import lognormal

mu, sigma = 3.2, .25

with open('data.json') as data_file:

    # Loading the JSON data from the data.json file.
    data = json.load(data_file)

    # Extracting the ad specific data
    na_ad_data = data["adstats"]["NA"]

    # Arrays for various platforms
    sample_json = {"video": [], "banner": []}
    app, desktop, mobile = sample_json, sample_json, sample_json

    # Variable to calculate the mean of the averages and high_bid
    banner_agg_avg, banner_agg_high, video_agg_avg, video_agg_high, banner_count, video_count = 0, 0, 0, 0, 0, 0

    # Iterating over the ad data
    for i in range(len(na_ad_data)):
        obj = na_ad_data[i]

        # Creating a new object with only the fields that are required
        new_object = {}
        new_object["timestamp"] = obj["timestamp"]
        new_object["high_bid"] = obj["spend"] / obj["impressions"]

        s = lognormal(mu, sigma, None)
        scale = (1 - (s / 85))

        new_object["avg_bid"] = scale * new_object["high_bid"]

        # Filtering the data and adding it to the appropriate list
        if obj["format"] == "video":
            video_count += 1
            video_agg_avg += new_object["avg_bid"]
            video_agg_high += new_object["high_bid"]
            if obj["platform"] == "app":
                app["video"].append(new_object)
            elif obj["platform"] == "desktop":
                desktop["video"].append(new_object)
            else:
                mobile["video"].append(new_object)
        else:
            banner_count += 1
            banner_agg_avg += new_object["avg_bid"]
            banner_agg_high += new_object["high_bid"]
            if obj["platform"] == "app":
                app["banner"].append(new_object)
            elif obj["platform"] == "desktop":
                desktop["banner"].append(new_object)
            else:
                mobile["banner"].append(new_object)

    final_json = {}
    final_json["app"] = app
    final_json["desktop"] = desktop
    final_json["mobile"] = mobile

    with open('parsed.json', 'w') as outfile:
        json.dump(final_json, outfile)

    banner_agg_avg /= banner_count
    banner_agg_high /= banner_count
    video_agg_avg /= video_count
    video_agg_high /= video_count

    mean_json = {}
    mean_json["video_avg_mean"] = video_agg_avg
    mean_json["video_high_mean"] = video_agg_high
    mean_json["banner_avg_mean"] = banner_agg_avg
    mean_json["banner_high_mean"] = banner_agg_high

    with open('avg_stats.json', 'w') as outfile:
        json.dump(mean_json, outfile)
