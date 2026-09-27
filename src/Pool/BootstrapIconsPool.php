<?php

declare(strict_types=1);

namespace Manuxi\SuluIconPickerBundle\Pool;

final class BootstrapIconsPool extends AbstractSpriteIconPool
{
    public const KEY = 'bootstrap-icons';

    public function getKey(): string
    {
        return self::KEY;
    }
}
