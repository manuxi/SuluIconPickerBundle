<?php

declare(strict_types=1);

namespace Manuxi\SuluIconPickerBundle\DependencyInjection;

use Manuxi\SuluIconPickerBundle\Pool\IconPoolInterface;
use Symfony\Component\Config\FileLocator;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Extension\PrependExtensionInterface;
use Symfony\Component\DependencyInjection\Loader\YamlFileLoader;
use Symfony\Component\HttpKernel\DependencyInjection\Extension;

class SuluIconPickerExtension extends Extension implements PrependExtensionInterface
{
    public const POOL_TAG = 'sulu_icon_picker.pool';

    public function prepend(ContainerBuilder $container): void
    {
        if ($container->hasExtension('framework')) {
            $container->prependExtensionConfig('framework', [
                'translator' => [
                    'paths' => [
                        __DIR__ . '/../Resources/translations',
                    ],
                ],
            ]);
        }
    }

    public function load(array $configs, ContainerBuilder $container): void
    {
        $container->registerForAutoconfiguration(IconPoolInterface::class)
            ->addTag(self::POOL_TAG);

        $loader = new YamlFileLoader($container, new FileLocator(__DIR__ . '/../Resources/config'));
        $loader->load('services.yaml');
    }
}
