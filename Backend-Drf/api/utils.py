import os
from django.conf import settings 
import matplotlib.pyplot as plt

def save_plot(plt_img_path):
    image_path=os.path.join(settings.MEDIA_ROOT,plt_img_path)
    plt.savefig(image_path)
    plt.close()
    image_url=os.path.join(settings.MEDIA_URL,plt_img_path)
    return image_url