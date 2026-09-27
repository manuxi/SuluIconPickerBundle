<?php

declare(strict_types=1);

namespace Manuxi\SuluIconPickerBundle\Admin;

use Sulu\Bundle\AdminBundle\Admin\Admin;

final class IconPickerAdmin extends Admin
{
    public const CONFIG_KEY = 'sulu_icon_picker';

    public function getConfigKey(): ?string
    {
        return self::CONFIG_KEY;
    }

    /**
     * The config's content is not used - it only makes the admin's update-config-hook mechanism call our JS
     * initializer after Sulu core's own "sulu_admin" hook has already registered "single_icon_selection",
     * so ours can safely override it (see src/Resources/js/index.js).
     */
    public function getConfig(): ?array
    {
        return ['enabled' => true];
    }
}
