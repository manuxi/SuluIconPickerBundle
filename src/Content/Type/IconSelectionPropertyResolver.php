<?php

declare(strict_types=1);

namespace Manuxi\SuluIconPickerBundle\Content\Type;

use Manuxi\SuluIconPickerBundle\Pool\IconPoolRegistry;
use Sulu\Content\Application\ContentResolver\Value\ContentView;
use Sulu\Content\Application\PropertyResolver\Resolver\PropertyResolverInterface;

final class IconSelectionPropertyResolver implements PropertyResolverInterface
{
    public function __construct(
        private readonly IconPoolRegistry $registry,
    ) {}

    public function resolve(mixed $data, string $locale, array $params = []): ContentView
    {
        $icon = $this->registry->createReference($data);

        // icons removed from a pool (e.g. after a bootstrap-icons update) resolve to null so templates can fall back
        $content = null !== $icon && $this->registry->isValid($icon) ? $icon->toArray() : null;

        return ContentView::create($content, [...$params]);
    }

    public static function getType(): string
    {
        return 'icon_selection';
    }
}
