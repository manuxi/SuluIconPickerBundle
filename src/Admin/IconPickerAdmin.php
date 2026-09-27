<?php

declare(strict_types=1);

namespace Manuxi\SuluIconPickerBundle\Admin;

use Manuxi\SuluIconPickerBundle\Pool\IconPoolRegistry;
use Sulu\Bundle\AdminBundle\Admin\Admin;
use Symfony\Component\Asset\Packages;

final class IconPickerAdmin extends Admin
{
    public const CONFIG_KEY = 'sulu_icon_picker';

    public function __construct(
        private readonly IconPoolRegistry $registry,
        private readonly Packages $packages,
    ) {}

    public function getConfigKey(): ?string
    {
        return self::CONFIG_KEY;
    }

    public function getConfig(): ?array
    {
        $pools = [];
        foreach ($this->registry->all() as $key => $pool) {
            $pools[$key] = [
                'key' => $key,
                'sprite' => $this->packages->getUrl($pool->getSpritePath()),
                'names' => $this->packages->getUrl($pool->getNamesPath()),
            ];
        }

        return [
            'defaultPool' => $this->registry->getDefaultKey(),
            'pools' => $pools,
        ];
    }
}
